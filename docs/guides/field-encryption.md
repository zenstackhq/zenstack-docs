---
description: Encrypting Fields
sidebar_position: 16
---

# Encrypting Fields (Preview)

> *This awesome feature is contributed by [Eugen Istoc](https://github.com/genu) and inspired by inspired by [prisma-field-encryption](https://github.com/47ng/prisma-field-encryption).*

ZenStack's field encryption feature helps you add an extra layer of protection to sensitive data stored in your database.

## Basic Usage

To use the feature, simply mark the fields you want to encrypt with the `@encrypt` attribute in ZModel:

```zmodel
model User {
  id         String @id @default(cuid())
  someSecret String @encrypt
}
```

When calling `enhance()` to create an enhanced PrismaClient, you need to pass an extra `encryption` settings to provide the encryption key if you use the default encryption:

```ts
function getEncryptionKey(): Uint8Array {
    // return a 32-byte key
}

const db = enhance(prisma, { user }, {
  encryption: {
    encryptionKey: getEncryptionKey()
  }
});
```

Or, if you choose to use a custom encryption, pass your custom `encrypt` and `decrypt` functions:

```ts
async function myEncrypt(model: string, field: FieldInfo, plain: string) {
  ...
}

async function myDecrypt(model: string, field: FieldInfo, cipher: string) {
  ...
}

const db = enhance(prisma, { user }, {
  encryption: {
    encrypt: myEncrypt,
    decrypt: myDecrypt
  }
});
```

The encryption feature requires the "encryption" enhancement kind to be enabled. If you manually specifies enhancement kinds, make sure it's included:

```ts
const db = enhance(prisma, { user }, {
  kinds: ['policy', 'encryption'],
  ...
});
```

When you use the enhanced PrismaClient, the encryption and decryption process happens transparently:
- When writing an encrypted field, the value will be encrypted before being stored in the database.
- When reading, the value will be decrypted before being returned to you.

## Default Encryption

The default encryption uses the [AES-GCM](https://en.wikipedia.org/wiki/Galois/Counter_Mode) algorithm to encrypt and decrypt the data with a 32-byte symmetric key. A random 12-byte [IV](https://en.wikipedia.org/wiki/Initialization_vector) is generated and used for each encryption operation, ensuring the encryption result is non-deterministic.

The data stored into the encrypted field consists of the following two parts (base-64 encoded and joined with a "."):

1. Metadata: 
   - Version byte (v): indicating the encryption version
   - Algorithm (a): AES-GCM
   - Key digest (k): a digest of the encryption key used
2. Encrypted data: IV bytes concatenated with the encrypted data bytes

### Key Rotation

Key rotation is a technique for enhancing security by periodically changing the encryption key. The default encryption supports key rotation by allowing you to specify multiple decryption keys:

```ts
const db = enhance(prisma, { user }, {
  encryption: {
    encryptionKey: encryptionKey,
    decryptionKeys: [oldKey1, oldKey2, ...]
  }
});
```

When reading an encrypted field, the decryption key with a digest matching the encryption key digest (extracted from the encrypted data) will be used to decrypt the data. If multiple keys have matching digests, each key will be tried in the order they are provided until the data is successfully decrypted.

Please note that the `encryptionKey` setting value will be automatically used as a decryption key, so you don't need to include it in the `decryptionKeys` setting.

:::warning FIELDS FAIL TO DECRYPT

When a field value fails to decrypt, the default encryption returns the cipher text as is. This allows incremental adoption of encryption, as you can enable the feature and then asynchronously encrypt existing data. During this period of time, plain data and encrypted data will coexist in the same field.

Let us know if you have security concerns about this behavior, and we can consider making it configurable in the future.

:::

### Data Migration

When you enable encryption on an existing field with data, you need to migrate the old data into encrypted form. Although ZenStack doesn't have a built-in data migration feature, it provides the infrastructure needed to implement a script.

#### 1. Asynchronously encrypt existing data

As mentioned in the previous section, the way how the default encryption handles decryption failures allows you to encrypt existing data asynchronously without taking your service down.

#### 2. Using the default encrypter

The `@zenstackhq/runtime` package exports an `Encrypter` class that you can use to encrypt data into the format compatible with what the enhanced PrismaClient expects:

```ts

import { Encrypter } from '@zenstackhq/runtime/encryption';

async function main() {
  const encrypter = new Encrypter(encryptionKey);

  let row = await getNextRow();
  while (row) {
    row.someSecret = await encrypter.encrypt(row.someSecret);
    await saveRow(row);
    row = await getNextRow();
  }
}

main();
```

## Custom Encryption

You can implement a customized encryption/decryption process by providing your own `encrypt` and `decrypt` functions. Doing so, you'll be fully responsible for managing keys, encoding and decoding the encrypted data, as well as implementing key rotation.

```ts
async function myEncrypt(model: string, field: FieldInfo, plain: string) {
  ...
}

async function myDecrypt(model: string, field: FieldInfo, cipher: string) {
  ...
}

const db = enhance(prisma, { user }, {
  encryption: {
    encrypt: myEncrypt,
    decrypt: myDecrypt
  }
});
```

## Limitations

- Only string fields are supported for encryption.
- Encrypted fields cannot be used in access policies.
- Although not explicitly disallowed, you should not use an encrypted field as index, for filtering or sorting.
