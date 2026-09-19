import fs from 'node:fs/promises';
import path from 'node:path';
import crypto from 'node:crypto';
import { ContractError, ContractIntegrityError, ScopeViolationError } from '../core/errors.js';

export class ProductContractEngine {
  constructor(projectRoot = process.cwd()) {
    this.projectRoot = projectRoot;
    this.productDir = path.join(this.projectRoot, 'product');
  }

  /**
   * Computes a deterministic SHA-256 hash of the canonical contract content.
   * Excludes metadata that changes on save (updated_at) and hash itself.
   */
  computeContractHash(contract) {
    const canonical = {
      contract_version: contract.contract_version,
      product: contract.product,
      problem: contract.problem,
      users: contract.users,
      desired_outcomes: contract.desired_outcomes,
      mvp_scope: contract.mvp_scope,
      out_of_scope: contract.out_of_scope,
      features: contract.features,
      requirements: contract.requirements,
      ux_preferences: contract.ux_preferences,
      technology_preferences: contract.technology_preferences,
      constraints: contract.constraints,
      security_requirements: contract.security_requirements,
      performance_expectations: contract.performance_expectations,
      deployment_expectations: contract.deployment_expectations,
      acceptance_criteria: contract.acceptance_criteria,
      success_criteria: contract.success_criteria,
      assumptions: contract.assumptions
    };
    const jsonStr = JSON.stringify(canonical, Object.keys(canonical).sort());
    return `sha256-${crypto.createHash('sha256').update(jsonStr).digest('hex')}`;
  }

  /**
   * Derives default explicit exclusions (out-of-scope items) based on domain and features.
   */
  deriveDefaultExclusions(domain, features = []) {
    const exclusions = [];
    const featureNames = features.map(f => f.name.toLowerCase());

    if (domain.includes('pharmacy') || domain.includes('healthcare')) {
      exclusions.push('Multi-hospital enterprise EHR synchronization (Deferred to v2)');
      exclusions.push('Third-party health insurance claim clearinghouse gateway (Deferred to v2)');
      exclusions.push('Custom peripheral firmware drivers / hardware manufacturing');
    } else if (domain.includes('finance') || domain.includes('fintech')) {
      exclusions.push('Cryptocurrency exchange integration & blockchain settlement');
      exclusions.push('Cross-border multi-currency foreign exchange arbitrage');
    } else if (domain.includes('retail') || domain.includes('pos')) {
      exclusions.push('Franchise multi-tenant supply-chain EDI interchange');
      exclusions.push('Custom barcode scanner hardware fabrication');
    } else {
      exclusions.push('Enterprise SSO / SAML federation (Deferred to v2)');
      exclusions.push('Multi-region active-active database clustering in MVP');
    }

    // Explicitly add any feature from discovery that was marked could or won't
    return exclusions;
  }

  /**
   * Generates acceptance criteria for a given requirement.
   */
  generateAcceptanceCriteria(req, domain) {
    const title = req.title.toLowerCase();
    if (title.includes('inventory') || title.includes('stock')) {
      return [
        'Given an active store catalog, When an item quantity changes, Then the stock level updates immediately with timestamped audit logging.',
        'Given an item with stock below reorder threshold, When inventory status is queried, Then an alert flag is emitted.',
        'Given a concurrent sale and restock event, When transactions are committed, Then inventory updates are strictly serialized without negative balances.'
      ];
    }
    if (title.includes('billing') || title.includes('pos') || title.includes('sales')) {
      return [
        'Given a cart with valid items, When checkout is finalized, Then a tax-compliant receipt is generated with unique transaction ID.',
        'Given an offline terminal with cached product catalog, When a bill is processed, Then the sale is committed locally and queued for synchronization.',
        'Given an invalid or negative total, When checkout is attempted, Then the transaction is rejected with RFC 7807 problem details.'
      ];
    }
    if (title.includes('prescription') || title.includes('rx') || title.includes('doctor')) {
      return [
        'Given a patient record and prescribing doctor name, When prescription is registered, Then items and dosage instructions are durably stored.',
        'Given a prescription-only drug, When dispensed at POS, Then the system verifies matching prescription ID before authorizing sale.',
        'Given an expired or fully dispensed prescription, When dispensation is attempted, Then the action is blocked with an explicit error.'
      ];
    }
    return [
      `Given valid inputs for ${req.title}, When executed, Then the system completes the operation with HTTP 200/201 and persists changes.`,
      `Given invalid or malformed inputs for ${req.title}, When received, Then the system rejects the operation with 400 Bad Request.`,
      `Given an unexpected internal error, When processing ${req.title}, Then the system fails safely and preserves data consistency.`
    ];
  }

  /**
   * Generates a canonical Product Contract from discovery state.
   */
  async generateContract(discoveryInput = null, version = 1) {
    let discovery = discoveryInput;
    if (!discovery) {
      const discoveryPath = path.join(this.productDir, 'discovery.json');
      try {
        const raw = await fs.readFile(discoveryPath, 'utf8');
        discovery = JSON.parse(raw);
      } catch (err) {
        throw new ContractError(`Cannot generate contract: Discovery state not found at ${discoveryPath}. Run 'eos idea' first.`);
      }
    }

    // 1. Enforce exit criteria: Check for unresolved critical or high unknowns
    const unresolvedCritical = (discovery.unknowns || []).filter(
      u => !u.resolved && (u.impact === 'critical' || u.impact === 'high')
    );
    if (unresolvedCritical.length > 0) {
      const list = unresolvedCritical.map(u => `[${u.impact.toUpperCase()}] ${u.question}`).join('; ');
      throw new ContractError(`Cannot generate Product Contract while critical unknowns remain unresolved: ${list}`);
    }

    // 2. Check for unresolved contradictions
    if ((discovery.contradictions || []).length > 0) {
      throw new ContractError(`Cannot generate Product Contract while contradictions remain unresolved: ${discovery.contradictions.join(', ')}`);
    }

    const domain = discovery.intent?.domain || 'general_software';
    const primaryGoal = discovery.intent?.primary_goal || discovery.raw_idea || 'Software Solution';
    const problemStatement = discovery.intent?.problem_statement || `Streamline and automate ${primaryGoal}`;

    // Users
    const users = (discovery.users || []).map(u => ({
      persona: u.persona,
      needs: u.needs,
      confirmed: u.confirmed !== false
    }));

    // Outcomes
    const outcomes = (discovery.desired_outcomes || []).length > 0
      ? discovery.desired_outcomes
      : [
          `Sub-150ms P95 latency on all primary workflows`,
          `100% operational uptime and local transaction survivability`,
          `Complete traceability from product requirements to test verification`
        ];

    // Features
    const features = (discovery.features || []).map((f, idx) => ({
      id: `FEAT-${String(idx + 1).padStart(3, '0')}`,
      name: f.name,
      description: f.description,
      priority: f.priority || 'must',
      status: f.confirmed ? 'confirmed' : 'inferred'
    }));

    // Requirements with REQ tags & acceptance criteria
    const requirements = features.map((f, idx) => {
      const reqId = `REQ-${String(idx + 1).padStart(3, '0')}`;
      const req = {
        id: reqId,
        title: f.name,
        type: f.status,
        description: f.description
      };
      req.acceptance_criteria = this.generateAcceptanceCriteria(req, domain);
      return req;
    });

    // MVP Scope
    const mvpScope = {
      summary: `MVP release delivering core operational capabilities for ${users.map(u => u.persona).join(', ') || 'end users'}`,
      included_features: features.filter(f => f.priority === 'must').map(f => f.name)
    };

    // Out of scope
    const outOfScope = this.deriveDefaultExclusions(domain, features);

    // Preferences & Constraints
    const platforms = discovery.preferences?.platform || ['Desktop Web', 'Mobile'];
    const uxPreferences = {
      style: discovery.preferences?.ui_style || 'Clean high-efficiency POS / Modern UI',
      platforms: platforms.length > 0 ? platforms : ['Web', 'Mobile']
    };

    const constraints = discovery.constraints || [];
    const techPreferences = {
      architecture_style: constraints.some(c => c.type === 'connectivity' && c.description.toLowerCase().includes('offline'))
        ? 'Offline-first client with durable local cache & background synchronization'
        : 'Cloud-native API service with reactive frontend',
      languages_frameworks: ['Node.js (v24+ Native ESM)', 'SQLite / Structured Storage', 'Vanilla CSS / Tokens']
    };

    // Security & Non-functional requirements
    const securityRequirements = [
      'OWASP API Security Top 10 compliance on all endpoints',
      'Role-based access control (RBAC) separating administrative and standard operators',
      'Encrypted local storage and parameterized database queries to prevent SQL injection',
      'Zero credential or token logging in diagnostic audit trails'
    ];

    const performanceExpectations = {
      latency_p95: '150ms for synchronous operations',
      throughput: '100 requests / second per local terminal',
      availability: '99.9% availability with local offline fallback'
    };

    const deploymentExpectations = {
      environment: 'Local Docker container or native Node.js runtime',
      target: 'Single store appliance or lightweight desktop/mobile runner'
    };

    // Global Acceptance criteria
    const acceptanceCriteria = [
      'All must-have MVP features implemented and verified with automated tests',
      'Zero critical or high security vulnerabilities detected by static analysis',
      'Offline transactions successfully commit locally and survive unexpected restarts',
      'Verification suite passes 100% with zero unresolved requirement drift'
    ];

    const successCriteria = [
      '100% requirement-to-test traceability demonstrated in verification report',
      'Zero data loss on unexpected terminal shutdown',
      'Positive user acceptance sign-off on core billing and inventory workflows'
    ];

    const openQuestions = (discovery.unknowns || []).map(u => ({
      id: u.id,
      question: u.question,
      impact: u.impact,
      resolved: !!u.resolved,
      answer: u.answer || ''
    }));

    const assumptions = (discovery.assumptions || []).map(a => ({
      id: a.id,
      assumption: a.assumption,
      impact_if_invalid: a.impact_if_invalid,
      validation_status: a.validation_status
    }));

    const now = new Date().toISOString();
    const contract = {
      contract_version: version,
      product: {
        name: primaryGoal,
        domain,
        description: problemStatement
      },
      problem: problemStatement,
      users,
      desired_outcomes: outcomes,
      mvp_scope: mvpScope,
      out_of_scope: outOfScope,
      features,
      requirements,
      ux_preferences: uxPreferences,
      technology_preferences: techPreferences,
      constraints,
      security_requirements: securityRequirements,
      performance_expectations: performanceExpectations,
      deployment_expectations: deploymentExpectations,
      acceptance_criteria: acceptanceCriteria,
      success_criteria: successCriteria,
      open_questions: openQuestions,
      assumptions,
      scope_locked: false,
      contract_hash: '',
      metadata: {
        generated_at: now,
        updated_at: now
      }
    };

    contract.contract_hash = this.computeContractHash(contract);
    return contract;
  }

  /**
   * Renders the product-contract.md document.
   */
  renderContractMarkdown(contract) {
    return `# Product Contract: ${contract.product.name}

**Contract Version:** ${contract.contract_version}  
**Domain:** ${contract.product.domain}  
**Scope Locked:** ${contract.scope_locked ? '🔒 LOCKED' : '🔓 OPEN'}  
**Integrity Hash:** \`${contract.contract_hash}\`  
**Generated At:** ${contract.metadata.generated_at}  

---

## 1. Problem Statement & Core Intent
> ${contract.problem}

## 2. Target Users & Personas
| Persona | Needs & Responsibilities | Status |
|---|---|:---:|
${contract.users.map(u => `| **${u.persona}** | ${u.needs} | ${u.confirmed ? '✓ Confirmed' : '⚠ Inferred'} |`).join('\n')}

## 3. Desired Outcomes & Business Goals
${contract.desired_outcomes.map(o => `- ${o}`).join('\n')}

---

## 4. MVP Scope & Boundaries
- **Summary:** ${contract.mvp_scope.summary}
- **Included Features:**
${contract.mvp_scope.included_features.map(f => `  - **${f}**`).join('\n')}

## 5. Explicit Exclusions (Out of Scope)
${contract.out_of_scope.map(e => `- ❌ ${e}`).join('\n')}

---

## 6. Detailed Feature Inventory
| ID | Feature Name | Description | Priority | Status |
|---|---|---|:---:|:---:|
${contract.features.map(f => `| \`${f.id}\` | **${f.name}** | ${f.description} | ${f.priority.toUpperCase()} | ${f.status} |`).join('\n')}

## 7. Functional Requirements & Acceptance Criteria
${contract.requirements.map(r => `### ${r.id}: ${r.title} (\`${r.type}\`)
${r.description}

**Acceptance Criteria:**
${r.acceptance_criteria.map(ac => `- ${ac}`).join('\n')}
`).join('\n')}

---

## 8. UX & Technology Preferences
- **UI Style:** ${contract.ux_preferences.style}
- **Target Platforms:** ${contract.ux_preferences.platforms.join(', ')}
- **Architecture Style:** ${contract.technology_preferences.architecture_style}
- **Stack:** ${contract.technology_preferences.languages_frameworks.join(', ')}

## 9. Constraints & Invariants
${contract.constraints.map(c => `- **[${c.type.toUpperCase()}]** ${c.description}`).join('\n')}

## 10. Security & Non-Functional Requirements
- **Security:**
${contract.security_requirements.map(s => `  - ${s}`).join('\n')}
- **Performance:** Latency P95: ${contract.performance_expectations.latency_p95}, Throughput: ${contract.performance_expectations.throughput || 'N/A'}, Availability: ${contract.performance_expectations.availability}
- **Deployment:** ${contract.deployment_expectations.environment} (${contract.deployment_expectations.target})

## 11. Assumptions & Validation Status
${contract.assumptions.map(a => `- **[${a.impact_if_invalid.toUpperCase()} IMPACT]** ${a.assumption} *(Status: ${a.validation_status})*`).join('\n')}

---
`;
  }

  /**
   * Renders scope.md contrasting MVP scope vs explicit exclusions.
   */
  renderScopeMarkdown(contract) {
    return `# Scope Specification & Boundary Lock

**Contract Version:** ${contract.contract_version}  
**Scope Lock Status:** ${contract.scope_locked ? '🔒 LOCKED' : '🔓 OPEN'}  
**Contract Hash:** \`${contract.contract_hash}\`  

---

## 1. IN MVP SCOPE (What We Are Building)
${contract.mvp_scope.summary}

### Included Feature Capabilities:
| Feature | Priority | Confirmation |
|---|:---:|:---:|
${contract.features.filter(f => f.priority === 'must').map(f => `| **${f.name}** | ${f.priority.toUpperCase()} | ${f.status} |`).join('\n')}

### Specific Deliverables:
${contract.requirements.map(r => `- **${r.id}**: ${r.title}`).join('\n')}

---

## 2. EXPLICITLY OUT OF SCOPE (What We Are NOT Building)
> [!WARNING]
> Downstream engineering agents MUST NOT implement features or workflows listed below without an approved Scope Change Request.

${contract.out_of_scope.map(item => `- ❌ **${item}**`).join('\n')}

---

## 3. Scope Change Protocol
1. Any modification, addition, or removal of in-scope capabilities requires a formal Change Request.
2. A Change Request automatically increments \`contract_version\` and unlocks the scope.
3. Implementation cannot resume until the revised contract is formally approved with a new cryptographic hash.
`;
  }

  /**
   * Renders acceptance.md matrix of criteria.
   */
  renderAcceptanceMarkdown(contract) {
    return `# Acceptance Criteria & Verification Matrix

**Contract Version:** ${contract.contract_version}  
**Contract Hash:** \`${contract.contract_hash}\`  

---

## 1. Global Acceptance Criteria
${contract.acceptance_criteria.map((ac, idx) => `${idx + 1}. **${ac}**`).join('\n')}

## 2. Success Criteria
${contract.success_criteria.map((sc, idx) => `${idx + 1}. **${sc}**`).join('\n')}

---

## 3. Feature-Level Requirement Acceptance Criteria
${contract.requirements.map(r => `### Requirement ${r.id}: ${r.title}
- **Classification:** \`${r.type}\`
- **Description:** ${r.description}

| # | Given / When / Then Condition |
|---|---|
${r.acceptance_criteria.map((ac, idx) => `| ${idx + 1} | ${ac} |`).join('\n')}
`).join('\n')}
`;
  }

  /**
   * Saves the product contract and generated markdown documents to disk.
   */
  async saveContract(contract) {
    await fs.mkdir(this.productDir, { recursive: true });

    contract.metadata.updated_at = new Date().toISOString();
    contract.contract_hash = this.computeContractHash(contract);

    const jsonPath = path.join(this.productDir, 'product-contract.json');
    const contractMdPath = path.join(this.productDir, 'product-contract.md');
    const scopeMdPath = path.join(this.productDir, 'scope.md');
    const acceptanceMdPath = path.join(this.productDir, 'acceptance.md');

    await fs.writeFile(jsonPath, JSON.stringify(contract, null, 2), 'utf8');
    await fs.writeFile(contractMdPath, this.renderContractMarkdown(contract), 'utf8');
    await fs.writeFile(scopeMdPath, this.renderScopeMarkdown(contract), 'utf8');
    await fs.writeFile(acceptanceMdPath, this.renderAcceptanceMarkdown(contract), 'utf8');

    return {
      jsonPath,
      contractMdPath,
      scopeMdPath,
      acceptanceMdPath,
      hash: contract.contract_hash
    };
  }

  /**
   * Loads the current contract from product/product-contract.json.
   */
  async loadContract() {
    const jsonPath = path.join(this.productDir, 'product-contract.json');
    try {
      const raw = await fs.readFile(jsonPath, 'utf8');
      return JSON.parse(raw);
    } catch {
      return null;
    }
  }

  /**
   * Loads the current approval state from product/approval.json.
   */
  async loadApproval() {
    const approvalPath = path.join(this.productDir, 'approval.json');
    try {
      const raw = await fs.readFile(approvalPath, 'utf8');
      return JSON.parse(raw);
    } catch {
      return null;
    }
  }

  /**
   * Approves the product contract, computes canonical hash, and locks scope.
   */
  async approveContract({ approvedBy = 'user' } = {}) {
    const contract = await this.loadContract();
    if (!contract) {
      throw new ContractError(`Cannot approve: Product Contract not found in ${this.productDir}. Run 'eos contract' first.`);
    }

    // Verify critical unknowns before approval
    const unresolvedCritical = (contract.open_questions || []).filter(
      q => !q.resolved && (q.impact === 'critical' || q.impact === 'high')
    );
    if (unresolvedCritical.length > 0) {
      throw new ContractError(`Cannot approve contract: Unresolved critical unknowns remain.`);
    }

    // Lock scope
    contract.scope_locked = true;
    contract.contract_hash = this.computeContractHash(contract);
    contract.metadata.updated_at = new Date().toISOString();

    // Re-save contract with locked scope
    await this.saveContract(contract);

    const approval = {
      contract_version: contract.contract_version,
      approved: true,
      approved_at: new Date().toISOString(),
      approved_by: approvedBy,
      contract_hash: contract.contract_hash,
      status: 'APPROVED',
      rejection_reason: null
    };

    const approvalPath = path.join(this.productDir, 'approval.json');
    await fs.writeFile(approvalPath, JSON.stringify(approval, null, 2), 'utf8');

    return {
      approved: true,
      contract_version: contract.contract_version,
      contract_hash: contract.contract_hash,
      approved_by: approvedBy
    };
  }

  /**
   * Rejects the product contract with a recorded reason.
   */
  async rejectContract({ reason = 'Contract rejected by user', rejectedBy = 'user' } = {}) {
    const contract = await this.loadContract();
    if (!contract) {
      throw new ContractError(`Cannot reject: Product Contract not found in ${this.productDir}.`);
    }

    contract.scope_locked = false;
    await this.saveContract(contract);

    const approval = {
      contract_version: contract.contract_version,
      approved: false,
      approved_at: new Date().toISOString(),
      approved_by: rejectedBy,
      contract_hash: contract.contract_hash,
      status: 'REJECTED',
      rejection_reason: reason
    };

    const approvalPath = path.join(this.productDir, 'approval.json');
    await fs.writeFile(approvalPath, JSON.stringify(approval, null, 2), 'utf8');

    return {
      approved: false,
      status: 'REJECTED',
      reason
    };
  }

  /**
   * Verifies the cryptographic integrity of the contract against the durable approval record.
   * Throws ContractIntegrityError if tampering or post-approval edits are detected.
   */
  async verifyContractIntegrity() {
    const contract = await this.loadContract();
    if (!contract) {
      return { valid: false, reason: 'CONTRACT_NOT_FOUND' };
    }

    const approval = await this.loadApproval();
    if (!approval) {
      return { valid: false, reason: 'CONTRACT_NOT_APPROVED', details: 'No approval.json record found.' };
    }

    if (!approval.approved || approval.status !== 'APPROVED') {
      return {
        valid: false,
        reason: 'CONTRACT_NOT_APPROVED',
        status: approval.status,
        rejection_reason: approval.rejection_reason
      };
    }

    // Compute current actual hash
    const actualHash = this.computeContractHash(contract);
    const expectedHash = approval.contract_hash;

    if (actualHash !== expectedHash) {
      throw new ContractIntegrityError(
        `CONTRACT_TAMPERED: Contract content has been modified after approval without an authorized Scope Change Request. Expected hash '${expectedHash}', but computed '${actualHash}'.`,
        expectedHash,
        actualHash
      );
    }

    if (contract.contract_version !== approval.contract_version) {
      throw new ContractIntegrityError(
        `CONTRACT_VERSION_MISMATCH: Contract version ${contract.contract_version} does not match approved version ${approval.contract_version}.`,
        approval.contract_version,
        contract.contract_version
      );
    }

    return {
      valid: true,
      contract_version: contract.contract_version,
      contract_hash: actualHash,
      approved_by: approval.approved_by,
      approved_at: approval.approved_at,
      scope_locked: contract.scope_locked
    };
  }

  /**
   * Validates whether a candidate feature or requirement violates the frozen contract scope.
   */
  async validateScope(candidateItem) {
    const contract = await this.loadContract();
    if (!contract) {
      throw new ContractError(`No product contract found to validate scope against.`);
    }

    const itemLower = candidateItem.toLowerCase().trim();

    // Check against out of scope
    for (const excluded of contract.out_of_scope || []) {
      const excludedLower = excluded.toLowerCase();
      if (itemLower.includes(excludedLower) || excludedLower.includes(itemLower)) {
        throw new ScopeViolationError(
          `SCOPE_VIOLATION: '${candidateItem}' is explicitly OUT OF SCOPE (${excluded}). A formal Scope Change Request is required to amend scope.`,
          candidateItem
        );
      }
    }

    return {
      allowed: true,
      inScope: contract.mvp_scope.included_features.some(f => itemLower.includes(f.toLowerCase()))
    };
  }

  /**
   * Creates a formal Scope Change Request.
   * Increments contract_version, unlocks scope, invalidates previous approval, and requires re-approval.
   */
  async createChangeRequest({
    title,
    description,
    addedFeatures = [],
    removedFeatures = [],
    modifiedRequirements = [],
    requestedBy = 'user'
  } = {}) {
    const contract = await this.loadContract();
    if (!contract) {
      throw new ContractError(`Cannot create change request: Contract not found.`);
    }

    const newVersion = contract.contract_version + 1;

    // Apply feature additions
    addedFeatures.forEach((feat, idx) => {
      const id = `FEAT-${String(contract.features.length + idx + 1).padStart(3, '0')}`;
      contract.features.push({
        id,
        name: feat.name || feat,
        description: feat.description || feat.name || feat,
        priority: feat.priority || 'must',
        status: 'confirmed'
      });
      contract.mvp_scope.included_features.push(feat.name || feat);

      // Add corresponding requirement
      const reqId = `REQ-${String(contract.requirements.length + 1).padStart(3, '0')}`;
      const req = {
        id: reqId,
        title: feat.name || feat,
        type: 'confirmed',
        description: feat.description || feat.name || feat
      };
      req.acceptance_criteria = this.generateAcceptanceCriteria(req, contract.product.domain);
      contract.requirements.push(req);
    });

    // Apply feature removals
    removedFeatures.forEach(featName => {
      const lower = featName.toLowerCase();
      contract.features = contract.features.filter(f => !f.name.toLowerCase().includes(lower));
      contract.mvp_scope.included_features = contract.mvp_scope.included_features.filter(
        f => !f.toLowerCase().includes(lower)
      );
      contract.out_of_scope.push(`${featName} (Removed via Change Request v${newVersion})`);
    });

    // Unlock scope and bump version
    contract.contract_version = newVersion;
    contract.scope_locked = false;
    contract.contract_hash = this.computeContractHash(contract);
    contract.metadata.updated_at = new Date().toISOString();

    await this.saveContract(contract);

    // Invalidate approval state
    const pendingApproval = {
      contract_version: newVersion,
      approved: false,
      approved_at: null,
      approved_by: null,
      contract_hash: contract.contract_hash,
      status: 'PENDING',
      rejection_reason: null,
      change_request: {
        title,
        description,
        requested_by: requestedBy,
        requested_at: new Date().toISOString()
      }
    };

    const approvalPath = path.join(this.productDir, 'approval.json');
    await fs.writeFile(approvalPath, JSON.stringify(pendingApproval, null, 2), 'utf8');

    return {
      version: newVersion,
      contract,
      approval: pendingApproval
    };
  }
}
