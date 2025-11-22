const allowedLevels = ["Beginner", "Intermediate", "Advanced"];
const allowedCategories = ["Cardio", "Strength", "Flexibility", "Balance", "Other"];
const allowedDeviceModes = ["Sprint", "Jump", "Alert", "Master", "Slave"];
const allowedDeviceSupport = [0, 1, 2]; // integer enum values

function safeParseJson(input, fieldName) {
  if (typeof input === "string") {
    try {
      const parsed = JSON.parse(input);
      if (!Array.isArray(parsed) && typeof parsed !== "object") {
        throw new Error(`${fieldName} must be a JSON object or array.`);
      }
      return parsed;
    } catch {
      throw new Error(`${fieldName} must be valid JSON.`);
    }
  }
  return input;
}

// Validate payload for create or update
// `isPartial` = true means optional fields (update)
function validateWorkoutPayload(payload, isPartial = false) {
  if (!isPartial) {
    if (
      payload.duration === undefined ||
      payload.title === undefined ||
      payload.level === undefined ||
      payload.category === undefined
    ) {
      return "Missing required fields: duration, title, level, category are mandatory.";
    }
  }

  if (payload.duration !== undefined && (typeof payload.duration !== "number" || payload.duration <= 0)) {
    return "Duration must be a positive number.";
  }

  if (payload.level !== undefined && !allowedLevels.includes(payload.level)) {
    return `Invalid level. Allowed: ${allowedLevels.join(", ")}`;
  }

  if (payload.category !== undefined && !allowedCategories.includes(payload.category)) {
    return `Invalid category. Allowed: ${allowedCategories.join(", ")}`;
  }

  if (payload.device_mode !== undefined && !allowedDeviceModes.includes(payload.device_mode)) {
    return `Invalid device_mode. Allowed: ${allowedDeviceModes.join(", ")}`;
  }

  if (payload.device_support !== undefined && !allowedDeviceSupport.includes(payload.device_support)) {
    return `Invalid device_support. Allowed: ${allowedDeviceSupport.join(", ")}`;
  }

  if (payload.is_performance_test !== undefined && typeof payload.is_performance_test !== "boolean") {
    return "is_performance_test must be a boolean.";
  }

  if (payload.device_config !== undefined && typeof payload.device_config !== "boolean") {
    return "device_config must be a boolean.";
  }

  return null;
}

// Validate query filters
function validateWorkoutFilters(filters) {
  if (filters.level && !allowedLevels.includes(filters.level)) {
    return `Invalid level filter. Allowed: ${allowedLevels.join(", ")}`;
  }
  if (filters.category && !allowedCategories.includes(filters.category)) {
    return `Invalid category filter. Allowed: ${allowedCategories.join(", ")}`;
  }
  if (filters.device_mode && !allowedDeviceModes.includes(filters.device_mode)) {
    return `Invalid device_mode filter. Allowed: ${allowedDeviceModes.join(", ")}`;
  }
  if (filters.is_performance_test !== undefined) {
    if (filters.is_performance_test !== "true" && filters.is_performance_test !== "false") {
      return "is_performance_test filter must be boolean (true/false).";
    }
  }
  if (filters.device_support !== undefined) {
    const deviceSupportNum = parseInt(filters.device_support);
    if (!allowedDeviceSupport.includes(deviceSupportNum)) {
      return `Invalid device_support filter. Allowed: ${allowedDeviceSupport.join(", ")}`;
    }
  }
  if (filters.device_config !== undefined) {
    if (filters.device_config !== "true" && filters.device_config !== "false") {
      return "device_config filter must be boolean (true/false).";
    }
  }
  if (filters.created_from && isNaN(new Date(filters.created_from))) {
    return "Invalid created_from date.";
  }
  if (filters.created_to && isNaN(new Date(filters.created_to))) {
    return "Invalid created_to date.";
  }
  if (filters.min_duration !== undefined) {
    const num = parseInt(filters.min_duration);
    if (isNaN(num) || num < 0) return "min_duration must be a positive integer.";
  }
  if (filters.max_duration !== undefined) {
    const num = parseInt(filters.max_duration);
    if (isNaN(num) || num < 0) return "max_duration must be a positive integer.";
  }
  if (filters.limit !== undefined) {
    const num = parseInt(filters.limit);
    if (isNaN(num) || num <= 0) return "limit must be a positive integer.";
  }
  if (filters.offset !== undefined) {
    const num = parseInt(filters.offset);
    if (isNaN(num) || num < 0) return "offset must be a non-negative integer.";
  }
  return null;
}

module.exports = {
  allowedLevels,
  allowedCategories,
  allowedDeviceModes,
  allowedDeviceSupport,
  validateWorkoutPayload,
  validateWorkoutFilters,
  safeParseJson,
};
