import crypto from "crypto";

export const hashResetTokenSecret = (tokenSecret, pepper = "") =>
  crypto.createHash("sha256").update(`${tokenSecret}${pepper}`).digest("hex");

export const parseCompositeResetToken = (token) => {
  if (typeof token !== "string") {
    return null;
  }

  const tokenParts = token.split(".");
  if (tokenParts.length !== 2) {
    return null;
  }

  const tokenId = tokenParts[0]?.trim();
  const tokenSecret = tokenParts[1]?.trim();

  if (!tokenId || !tokenSecret) {
    return null;
  }

  return { tokenId, tokenSecret };
};

export const isTokenExpired = (expiresAt, nowEpochSeconds) =>
  typeof expiresAt !== "number" || expiresAt <= nowEpochSeconds;

export const isTokenUsable = ({
  status,
  expiresAt,
  storedTokenHash,
  candidateTokenHash,
  nowEpochSeconds,
}) => {
  if (status !== "active") {
    return false;
  }

  if (isTokenExpired(expiresAt, nowEpochSeconds)) {
    return false;
  }

  return storedTokenHash === candidateTokenHash;
};
