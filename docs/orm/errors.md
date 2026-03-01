---
sidebar_position: 16
description: ORM Errors
---

# Errors

The ORM throws an `ORMError` in case of failures. In case of an error thrown by the underlying database driver, ZenStack stores the database-specific error code and message in the `dbErrorCode` and `dbErrorMessage` fields of the `ORMError` object.

The `ORMError` class has the following fields:

```ts
/**
 * Reason code for ORM errors.
 */
export enum ORMErrorReason {
    /**
     * ORM client configuration error.
     */
    CONFIG_ERROR = 'config-error',

    /**
     * Invalid input error.
     */
    INVALID_INPUT = 'invalid-input',

    /**
     * The specified record was not found.
     */
    NOT_FOUND = 'not-found',

    /**
     * Operation is rejected by access policy.
     */
    REJECTED_BY_POLICY = 'rejected-by-policy',

    /**
     * Error was thrown by the underlying database driver.
     */
    DB_QUERY_ERROR = 'db-query-error',

    /**
     * The requested operation is not supported.
     */
    NOT_SUPPORTED = 'not-supported',

    /**
     * An internal error occurred.
     */
    INTERNAL_ERROR = 'internal-error',
}

/**
 * ZenStack ORM error.
 */
export class ORMError extends Error {
    /**
     * Error reason code.
     */
    reason: ORMErrorReason;
    
    /**
     * The name of the model that the error pertains to.
     */
    model?: string;

    /**
     * The error code given by the underlying database driver.
     */
    dbErrorCode?: unknown;

    /**
     * The error message given by the underlying database driver.
     */
    dbErrorMessage?: string;

    /**
     * The reason code for policy rejection. Only available when `reason` is `REJECTED_BY_POLICY`.
     */
    rejectedByPolicyReason?: RejectedByPolicyReason;

    /**
     * The SQL query that was executed. Only available when `reason` is `DB_QUERY_ERROR`.
     */
    sql?: string;

    /**
     * The parameters used in the SQL query. Only available when `reason` is `DB_QUERY_ERROR`.
     */
    sqlParams?: readonly unknown[];
}

/**
 * Reason code for ORM errors.
 */
export enum ORMErrorReason {
    /**
     * ORM client configuration error.
     */
    CONFIG_ERROR = 'config-error',

    /**
     * Invalid input error.
     */
    INVALID_INPUT = 'invalid-input',

    /**
     * The specified record was not found.
     */
    NOT_FOUND = 'not-found',

    /**
     * Operation is rejected by access policy.
     */
    REJECTED_BY_POLICY = 'rejected-by-policy',

    /**
     * Error was thrown by the underlying database driver.
     */
    DB_QUERY_ERROR = 'db-query-error',

    /**
     * The requested operation is not supported.
     */
    NOT_SUPPORTED = 'not-supported',

    /**
     * An internal error occurred.
     */
    INTERNAL_ERROR = 'internal-error',
}

/**
 * Reason code for policy rejection.
 */
export enum RejectedByPolicyReason {
    /**
     * Rejected because the operation is not allowed by policy.
     */
    NO_ACCESS = 'no-access',

    /**
     * Rejected because the result cannot be read back after mutation due to policy.
     */
    CANNOT_READ_BACK = 'cannot-read-back',

    /**
     * Other reasons.
     */
    OTHER = 'other',
}
```