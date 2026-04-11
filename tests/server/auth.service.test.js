import { jest } from "@jest/globals";

const findUserByEmail = jest.fn();
const findUserByUsername = jest.fn();
const createUser = jest.fn();
const getDisabledAccountDetails = jest.fn();
const normalizeDisabledState = jest.fn();
const toPublicUser = jest.fn();
const hash = jest.fn();
const compare = jest.fn();
const sign = jest.fn();

jest.unstable_mockModule("../../server/src/modules/auth/auth.repository.js", () => ({
  findUserByEmail,
  findUserByUsername,
  createUser,
}));

jest.unstable_mockModule("../../server/src/modules/auth/auth.utils.js", () => ({
  getDisabledAccountDetails,
  normalizeDisabledState,
  toPublicUser,
}));

jest.unstable_mockModule("bcrypt", () => ({
  default: {
    hash,
    compare,
  },
}));

jest.unstable_mockModule("jsonwebtoken", () => ({
  default: {
    sign,
  },
}));
let registerUser;
let loginUser;

describe("Auth Service", () => {
  beforeAll(async () => {
    ({ registerUser, loginUser } = await import("../../server/src/modules/auth/auth.service.js"));
  });

  beforeEach(() => {
    jest.clearAllMocks();
    process.env.JWT_SECRET = "test-secret";
    normalizeDisabledState.mockResolvedValue();
    getDisabledAccountDetails.mockReturnValue({ message: "disabled" });
    toPublicUser.mockImplementation((user) => ({ id: user._id, username: user.username }));
  });

  test("returns validation errors if signup fields are missing", async () => {
    const result = await registerUser({ username: "", email: "", password: "" });

    expect(result.ok).toBe(false);
    expect(result.status).toBe(400);
    expect(result.errors.username).toBe("Username is required");
    expect(result.errors.email).toBe("Email is required");
    expect(result.errors.password).toBe("Password is required");
  });

  test("returns conflict when signup email is already in use", async () => {
    findUserByEmail.mockResolvedValue({ _id: "existing-user" });

    const result = await registerUser({
      username: "new_user",
      email: "test@example.com",
      password: "password123",
    });

    expect(result.ok).toBe(false);
    expect(result.status).toBe(409);
    expect(result.errors.email).toBe("Email already in use");
  });

  test("logs in a valid user successfully", async () => {
    const user = {
      _id: { toString: () => "user-1" },
      username: "tester",
      passwordHash: "hashed",
      role: "user",
      isDisabled: false,
    };

    findUserByEmail.mockResolvedValue(user);
    compare.mockResolvedValue(true);
    sign.mockReturnValue("signed-token");

    const result = await loginUser({
      email: "tester@example.com",
      password: "password123",
    });

    expect(result.ok).toBe(true);
    expect(result.status).toBe(200);
    expect(result.token).toBe("signed-token");
    expect(compare).toHaveBeenCalledWith("password123", "hashed");
    expect(sign).toHaveBeenCalled();
  });

  test("returns invalid credentials when password does not match", async () => {
    findUserByEmail.mockResolvedValue({
      _id: { toString: () => "user-1" },
      passwordHash: "hashed",
      role: "user",
      isDisabled: false,
    });
    compare.mockResolvedValue(false);

    const result = await loginUser({
      email: "tester@example.com",
      password: "wrong-password",
    });

    expect(result.ok).toBe(false);
    expect(result.status).toBe(401);
    expect(result.errors.general).toBe("Invalid email or password");
  });
});
