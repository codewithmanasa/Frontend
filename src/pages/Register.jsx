// import React, { useState } from "react";
// import { useNavigate, Link } from "react-router-dom";
// import { useAuth } from "../context/Authcontext";
// import "../styles/Auth.css";

// const Register = () => {
//   const [formData, setFormData] = useState({
//     username: "",
//     email: "",
//     password: "",
//     confirmPassword: "",
//   });
//   const [error, setError] = useState("");
//   const [loading, setLoading] = useState(false);
//   const navigate = useNavigate();
//   const { register } = useAuth();

//   const handleChange = (e) => {
//     setFormData({
//       ...formData,
//       [e.target.name]: e.target.value,
//     });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError("");

//     if (formData.password !== formData.confirmPassword) {
//       setError("Passwords do not match");
//       return;
//     }

//     if (formData.password.length < 6) {
//       setError("Password must be at least 6 characters");
//       return;
//     }

//     setLoading(true);

//     const result = await register(
//       formData.username,
//       formData.email,
//       formData.password
//     );

//     if (result.success) {
//       navigate("/login", {
//         state: { message: "Registration successful! Please log in." },
//       });
//     } else {
//       setError(result.message);
//     }

//     setLoading(false);
//   };

//   return (
//     <div className="auth-container">
//       <div className="auth-card">
//         <div className="auth-header">
//           <h1>Create Account</h1>
//           <p>Sign up to get started</p>
//         </div>

//         {error && <div className="error-message">{error}</div>}

//         <form onSubmit={handleSubmit} className="auth-form">
//           <div className="form-group">
//             <label htmlFor="username">Username</label>
//             <input
//               type="text"
//               id="username"
//               name="username"
//               value={formData.username}
//               onChange={handleChange}
//               required
//               minLength="3"
//               maxLength="20"
//               placeholder="Choose a username"
//               className="form-input"
//             />
//           </div>

//           <div className="form-group">
//             <label htmlFor="email">Email</label>
//             <input
//               type="email"
//               id="email"
//               name="email"
//               value={formData.email}
//               onChange={handleChange}
//               required
//               placeholder="Enter your email"
//               className="form-input"
//             />
//           </div>

//           <div className="form-group">
//             <label htmlFor="password">Password</label>
//             <input
//               type="password"
//               id="password"
//               name="password"
//               value={formData.password}
//               onChange={handleChange}
//               required
//               minLength="6"
//               placeholder="Create a password"
//               className="form-input"
//             />
//           </div>

//           <div className="form-group">
//             <label htmlFor="confirmPassword">Confirm Password</label>
//             <input
//               type="password"
//               id="confirmPassword"
//               name="confirmPassword"
//               value={formData.confirmPassword}
//               onChange={handleChange}
//               required
//               placeholder="Confirm your password"
//               className="form-input"
//             />
//           </div>

//           <button type="submit" className="btn btn-primary" disabled={loading}>
//             {loading ? "Creating Account..." : "Sign Up"}
//           </button>
//         </form>

//         <div className="auth-footer">
//           <p>
//             Already have an account? <Link to="/login">Sign in</Link>
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Register;
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/Authcontext.jsx";
import "../styles/Auth.css";
import "../styles/Register.css";

const Register = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [touched, setTouched] = useState({
    username: false,
    email: false,
    password: false,
    confirmPassword: false,
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { register } = useAuth();

  // ─── Validation Rules ───────────────────────────────────────────────
  const validate = (name, value, allValues = formData) => {
    switch (name) {
      case "username": {
        if (!value.trim()) return "Username is required";
        if (value.trim().length < 3)
          return "Username must be at least 3 characters";
        if (value.trim().length > 20)
          return "Username must be at most 20 characters";
        if (!/^[a-zA-Z0-9_]+$/.test(value))
          return "Username can only contain letters, numbers, and underscores";
        return "";
      }

      case "email": {
        if (!value.trim()) return "Email is required";
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value))
          return "Enter a valid email address";
        return "";
      }

      case "password": {
        if (!value) return "Password is required";
        if (value.length < 6) return "Password must be at least 6 characters";
        if (value.length > 50) return "Password must be at most 50 characters";
        if (!/[A-Z]/.test(value))
          return "Password must contain at least one uppercase letter";
        if (!/[0-9]/.test(value))
          return "Password must contain at least one number";
        if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(value))
          return "Password must contain at least one special character";
        return "";
      }

      case "confirmPassword": {
        if (!value) return "Please confirm your password";
        if (value !== allValues.password) return "Passwords do not match";
        return "";
      }

      default:
        return "";
    }
  };

  // ─── Validate All Fields ─────────────────────────────────────────────
  const validateAll = () => {
    const newErrors = {};
    Object.keys(formData).forEach((field) => {
      newErrors[field] = validate(field, formData[field], formData);
    });
    setErrors(newErrors);
    return Object.values(newErrors).every((e) => e === "");
  };

  // ─── Handlers ────────────────────────────────────────────────────────
  const handleChange = (e) => {
    const { name, value } = e.target;
    const updatedForm = { ...formData, [name]: value };
    setFormData(updatedForm);

    // Live validation after field is touched
    if (touched[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: validate(name, value, updatedForm),
        // Also re-validate confirmPassword if password changes
        ...(name === "password"
          ? {
              confirmPassword: validate(
                "confirmPassword",
                updatedForm.confirmPassword,
                updatedForm
              ),
            }
          : {}),
      }));
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    setErrors((prev) => ({
      ...prev,
      [name]: validate(name, value, formData),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Mark all fields as touched
    setTouched({
      username: true,
      email: true,
      password: true,
      confirmPassword: true,
    });

    if (!validateAll()) return;

    setLoading(true);

    const result = await register(
      formData.username,
      formData.email,
      formData.password
    );

    if (result.success) {
      navigate("/login", {
        state: { message: "Registration successful! Please log in." },
      });
    } else {
      setError(result.message);
    }

    setLoading(false);
  };

  // ─── Password Strength Indicator ─────────────────────────────────────
  const getPasswordStrength = (password) => {
    if (!password) return { label: "", color: "", width: "0%" };
    let score = 0;
    if (password.length >= 6) score++;
    if (password.length >= 10) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) score++;

    if (score <= 2) return { label: "Weak", color: "#e74c3c", width: "33%" };
    if (score <= 3)
      return { label: "Moderate", color: "#f39c12", width: "66%" };
    return { label: "Strong", color: "#27ae60", width: "100%" };
  };

  const strength = getPasswordStrength(formData.password);

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h1>Create Account</h1>
          <p>Sign up to get started</p>
        </div>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit} className="auth-form" noValidate>
          {/* ── Username ── */}
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="Choose a username (3–20 chars)"
              className={`form-input ${
                touched.username
                  ? errors.username
                    ? "input-error"
                    : "input-success"
                  : ""
              }`}
            />
            {touched.username && errors.username && (
              <span className="field-error">{errors.username}</span>
            )}
            {touched.username && !errors.username && (
              <span className="field-success">✓ Looks good!</span>
            )}
          </div>

          {/* ── Email ── */}
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="Enter your email"
              className={`form-input ${
                touched.email
                  ? errors.email
                    ? "input-error"
                    : "input-success"
                  : ""
              }`}
            />
            {touched.email && errors.email && (
              <span className="field-error">{errors.email}</span>
            )}
            {touched.email && !errors.email && (
              <span className="field-success">✓ Valid email!</span>
            )}
          </div>

          {/* ── Password ── */}
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="Create a strong password"
              className={`form-input ${
                touched.password
                  ? errors.password
                    ? "input-error"
                    : "input-success"
                  : ""
              }`}
            />
            {/* Password Strength Bar */}
            {formData.password && (
              <div className="password-strength">
                <div className="strength-bar">
                  <div
                    className="strength-fill"
                    style={{
                      width: strength.width,
                      backgroundColor: strength.color,
                    }}
                  />
                </div>
                <span
                  className="strength-label"
                  style={{ color: strength.color }}
                >
                  {strength.label}
                </span>
              </div>
            )}
            {touched.password && errors.password && (
              <span className="field-error">{errors.password}</span>
            )}
            {/* Password hints */}
            {formData.password && (
              <ul className="password-hints">
                <li
                  className={
                    formData.password.length >= 6 ? "hint-pass" : "hint-fail"
                  }
                >
                  {formData.password.length >= 6 ? "✓" : "✗"} At least 6
                  characters
                </li>
                <li
                  className={
                    /[A-Z]/.test(formData.password) ? "hint-pass" : "hint-fail"
                  }
                >
                  {/[A-Z]/.test(formData.password) ? "✓" : "✗"} One uppercase
                  letter
                </li>
                <li
                  className={
                    /[0-9]/.test(formData.password) ? "hint-pass" : "hint-fail"
                  }
                >
                  {/[0-9]/.test(formData.password) ? "✓" : "✗"} One number
                </li>
                <li
                  className={
                    /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(
                      formData.password
                    )
                      ? "hint-pass"
                      : "hint-fail"
                  }
                >
                  {/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(
                    formData.password
                  )
                    ? "✓"
                    : "✗"}{" "}
                  One special character
                </li>
              </ul>
            )}
          </div>

          {/* ── Confirm Password ── */}
          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="Confirm your password"
              className={`form-input ${
                touched.confirmPassword
                  ? errors.confirmPassword
                    ? "input-error"
                    : "input-success"
                  : ""
              }`}
            />
            {touched.confirmPassword && errors.confirmPassword && (
              <span className="field-error">{errors.confirmPassword}</span>
            )}
            {touched.confirmPassword &&
              !errors.confirmPassword &&
              formData.confirmPassword && (
                <span className="field-success">✓ Passwords match!</span>
              )}
          </div>

          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? "Creating Account..." : "Sign Up"}
          </button>
        </form>

        <div className="auth-footer">
          <p>
            Already have an account? <Link to="/login">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
