---
sidebar_position: 16
description: ORM Errors
---

# Errors

The ORM uses the following error classes from `@zenstackhq/orm` to represent different types of failures:

## `InputValidationError`

This error is thrown when the argument passed to the ORM methods is invalid, e.g., missing required fields, or containing unknown fields. The `cause` property is set to the original error thrown during validation.

If [input validation](../orm/validation.md) is used, this error is also thrown when the validation rules are violated.

## `NotFoundError`

This error is thrown when a requested record is not found in the database, e.g., when calling `findUniqueOrThrow`, `update`, etc.

## `QueryError`

This error is used to encapsulate all other errors thrown from the underlying database driver. The `cause` property is set to the original error thrown.

## `RejectedByPolicyError`

This error is thrown when an operation is rejected by [access control policies](../orm/access-control/index.md).
