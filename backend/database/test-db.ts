import { checkDbConnection } from '../src/config/db';
import { userRepository } from '../src/repositories/userRepository';

const test = async () => {
  await checkDbConnection();

  console.log("Testing User Creation...");
  try {
    const newUser = await userRepository.create({
      name: 'John Doe',
      email: 'john@example.com',
      password_hash: 'hashed_password_placeholder',
      phone: '1234567890',
      role: 'buyer',
    });
    console.log("✅ User created:", newUser);

    const foundUser = await userRepository.findByEmail('john@example.com');
    console.log("✅ User found:", foundUser?.name);

  } catch (error: any) {
    console.error("❌ Error:", error.message);
  }
  process.exit(0);
};

test();