// lib/encryption.ts - SIMPLE WORKING VERSION
import crypto from 'crypto'

export class EncryptionService {
  private static algorithm = 'aes-256-cbc'
  
  // Generate a key from a string (always 32 bytes)
  private static getKey(): Buffer {
    const keyString = process.env.ENCRYPTION_KEY || 'default-32-byte-key-for-development-only'
    const key = Buffer.alloc(32)
    Buffer.from(keyString).copy(key)
    return key
  }

  static encrypt(text: string): string {
    try {
      const iv = crypto.randomBytes(16)
      const cipher = crypto.createCipheriv(this.algorithm, this.getKey(), iv)
      
      let encrypted = cipher.update(text, 'utf8', 'hex')
      encrypted += cipher.final('hex')
      
      return iv.toString('hex') + ':' + encrypted
    } catch (error) {
      console.error('Encryption failed, returning plain text with warning:', error)
      return 'PLAINTEXT:' + text
    }
  }

  static decrypt(encryptedText: string): string {
    try {
      if (encryptedText.startsWith('PLAINTEXT:')) {
        return encryptedText.substring(10)
      }
      
      const [ivHex, encrypted] = encryptedText.split(':')
      const iv = Buffer.from(ivHex, 'hex')
      const decipher = crypto.createDecipheriv(this.algorithm, this.getKey(), iv)
      
      let decrypted = decipher.update(encrypted, 'hex', 'utf8')
      decrypted += decipher.final('utf8')
      
      return decrypted
    } catch (error) {
      console.error('Decryption failed:', error)
      return ''
    }
  }

  static hashSensitiveData(data: string): string {
    return crypto.createHash('sha256').update(data).digest('hex')
  }

  static encryptObject(data: Record<string, any>, fields: string[]): Record<string, any> {
    const encrypted = { ...data }
    
    fields.forEach(field => {
      if (encrypted[field] && typeof encrypted[field] === 'string') {
        encrypted[field] = this.encrypt(encrypted[field])
      }
    })
    
    return encrypted
  }
}