import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { loginStart, loginSuccess } from "../../store/slices/authSlice";
import { useAuth } from "../../hooks/useAuth";
import { storeAuthData } from "./authStorage";
import { theme } from "../../theme/theme";
import { validateEmail } from "../../config/utils";
import { LoginRegisterApi } from "../../api/loginRegisterApi";
import {
  Box,
  Typography,
  TextField,
  Button,
  Alert,
  CircularProgress,
  Container,
  useMediaQuery,
  useTheme as useMuiTheme,
} from "@mui/material";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false); // For password visibility toggle

  const { login, isAuthenticated, user, loading, error } = useAuth();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const muiTheme = useMuiTheme();
  const isMobile = useMediaQuery(muiTheme.breakpoints.down("sm")); // Better than manual resize listener
  const isTablet = useMediaQuery(muiTheme.breakpoints.between("sm", "md"));
  useEffect(() => {
    if (isAuthenticated && user) {
      const isAdmin = user?.roles?.includes("ADMIN") || user?.role === "ADMIN";
      navigate(isAdmin ? "/report" : "/timesheet", { replace: true });
    }
  }, [isAuthenticated, user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const obj = {
      emailId: email,
      password: password,
    };
    const success = await LoginRegisterApi.loginUser(obj);
    console.log("login data____", success);
    if (success && success.status) {
      localStorage.setItem("user", JSON.stringify(success.user));
      localStorage.setItem("token", success?.token);
      storeAuthData(success.data);
      await login(success.user);
      // const isAdmin =
      //   success?.user.role?.includes("USER") || success?.user.role === "USER";
      // navigate(isAdmin ? "/report" : "/timesheet", { replace: true });
    }
  };

  const validate = () => {
    if (password.length === 0) {
      alert("Password cannot be empty!");
      return false;
    }
    if ((email && !validateEmail(email)) || email?.length == 0) {
      alert("Format of email is invalid!");
      return false;
    }

    return true;
  };

  const handleKeyPress = (e) => {
    if (
      e.key === "Enter" &&
      email &&
      email.length > 0 &&
      password &&
      password.length > 0 &&
      validate()
    ) {
      handleSubmit(e);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: theme.colors.background,
        p: isMobile ? 1 : 2,
        overflow: "auto",
      }}
    >
      <Container maxWidth="xs" sx={{ position: "relative", zIndex: 1 }}>
  <Box
    component="form"
    onSubmit={handleSubmit}
    sx={{
      background: theme.glass.background,
      backdropFilter: theme.glass.backdropFilter,
      WebkitBackdropFilter: theme.glass.backdropFilter,
      border: theme.glass.border,
      boxShadow: theme.glass.boxShadow,
      p: isMobile ? 3 : 5,
      borderRadius: theme.borderRadius.large,
      position: "relative",
      overflow: "hidden",
      transition: "all 0.4s ease",
      "&::before": {
        content: '""',
        position: "absolute",
        inset: 0,
        background: `linear-gradient(135deg, 
          rgba(255,255,255,0.05) 0%, 
          transparent 50%, 
          rgba(0,0,0,0.4) 100%)`,
        pointerEvents: "none",
      },
      "&::after": {
        content: '""',
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        height: "1px",
        background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)",
        pointerEvents: "none",
      },
      "&:hover": {
        transform: "translateY(-8px)",
        boxShadow: "0 24px 48px rgba(0, 0, 0, 0.7)",
      },
    }}
  >
    {/* Header */}
    <Box sx={{ textAlign: "center", mb: 4 }}>
      <Typography
        sx={{
          color: theme.colors.white,
          fontWeight: 800,
          fontSize: isMobile ? "24px" : "30px",
          letterSpacing: "1px",
          textShadow: `0 0 20px ${theme.colors.primary}40`,
          background: `linear-gradient(90deg, ${theme.colors.primaryLight}, ${theme.colors.primary})`,
          backgroundClip: "text",
          WebkitBackgroundClip: "text",
          color: "transparent",
        }}
      >
        Task Status System
      </Typography>
    </Box>

    {/* Form Fields */}
    <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
      {/* Email Field - Glossy Dark Style */}
      <TextField
        label="Email Address"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        onKeyPress={handleKeyPress}
        placeholder="name@company.com"
        disabled={loading}
        required
        fullWidth
        variant="filled"
        InputProps={{
          disableUnderline: true,
          style: { borderRadius: theme.borderRadius.medium },
        }}
        sx={{
          "& .MuiFilledInput-root": {
            background: "rgba(255, 255, 255, 0.06)",
            backdropFilter: "blur(10px)",
            border: "1px solid rgba(255, 255, 255, 0.1)",
            borderRadius: theme.borderRadius.medium,
            overflow: "hidden",
            transition: "all 0.3s ease",
            "&:hover": {
              background: "rgba(255, 255, 255, 0.09)",
              borderColor: theme.colors.primaryLight,
            },
            "&.Mui-focused": {
              background: "rgba(255, 255, 255, 0.1)",
              borderColor: theme.colors.primary,
              boxShadow: `0 0 0 2px ${theme.colors.primary}30`,
            },
          },
          "& .MuiInputLabel-root": {
            color: theme.colors.text.secondary,
            fontWeight: 500,
          },
          "& .MuiInputLabel-root.Mui-focused": {
            color: theme.colors.primaryLight,
          },
          "& input": {
            color: theme.colors.text.primary,
            fontSize: "16px",
            py: 2.2,
          },
        }}
      />

      {/* Password Field */}
      <TextField
        label="Password"
        type={showPassword ? "text" : "password"}
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        onKeyPress={handleKeyPress}
        placeholder="••••••••"
        disabled={loading}
        required
        fullWidth
        variant="filled"
        InputProps={{
          disableUnderline: true,
          style: { borderRadius: theme.borderRadius.medium },
          endAdornment: (
            <Button
              onClick={togglePasswordVisibility}
              disabled={loading}
              sx={{
                color: theme.colors.text.secondary,
                textTransform: "none",
                fontWeight: 500,
                minWidth: "auto",
                "&:hover": { color: theme.colors.primaryLight, bgcolor: "transparent" },
              }}
            >
              {showPassword ? "Hide" : "Show"}
            </Button>
          ),
        }}
        sx={{
          "& .MuiFilledInput-root": {
            background: "rgba(255, 255, 255, 0.06)",
            backdropFilter: "blur(10px)",
            border: "1px solid rgba(255, 255, 255, 0.1)",
            borderRadius: theme.borderRadius.medium,
            transition: "all 0.3s ease",
            "&:hover": {
              background: "rgba(255, 255, 255, 0.09)",
              borderColor: theme.colors.primaryLight,
            },
            "&.Mui-focused": {
              background: "rgba(255, 255, 255, 0.1)",
              borderColor: theme.colors.primary,
              boxShadow: `0 0 0 2px ${theme.colors.primary}30`,
            },
          },
          "& .MuiInputLabel-root": {
            color: theme.colors.text.secondary,
            fontWeight: 500,
          },
          "& .MuiInputLabel-root.Mui-focused": {
            color: theme.colors.primaryLight,
          },
          "& input": {
            color: theme.colors.text.primary,
            fontSize: "16px",
            py: 2.2,
          },
        }}
      />

      {error && (
        <Alert
          severity="error"
          sx={{
            borderRadius: theme.borderRadius.small,
            background: "rgba(239, 83, 80, 0.15)",
            border: "1px solid rgba(239, 83, 80, 0.3)",
            color: "#ff8a80",
            "& .MuiAlert-icon": { color: "#ff5252" },
          }}
        >
          {error}
        </Alert>
      )}

      {/* Modern Glossy Button */}
      <Button
        type="submit"
        disabled={loading}
        fullWidth
        variant="contained"
        sx={{
          py: 1.8,
          fontSize: "17px",
          fontWeight: 700,
          textTransform: "none",
          borderRadius: theme.borderRadius.medium,
          background: `linear-gradient(135deg, ${theme.colors.primary} 0%, ${theme.colors.primaryDark} 100%)`,
          backgroundSize: "200% 200%",
          boxShadow: `0 8px 25px ${theme.colors.primary}40`,
          position: "relative",
          overflow: "hidden",
          transition: "all 0.4s ease",
          "&::before": {
            content: '""',
            position: "absolute",
            top: 0,
            left: "-100%",
            width: "100%",
            height: "100%",
            background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)",
            transition: "0.7s",
          },
          "&:hover::before": {
            left: "100%",
          },
          "&:hover": {
            transform: "translateY(-3px)",
            boxShadow: `0 12px 35px ${theme.colors.primary}60`,
            backgroundPosition: "right center",
          },
          "&:active": {
            transform: "translateY(-1px)",
          },
          "&.Mui-disabled": {
            background: theme.colors.mediumGray,
            opacity: 0.6,
          },
        }}
      >
        {loading ? (
          <>
            <CircularProgress size={22} thickness={4.5} sx={{ mr: 1.5, color: "white" }} />
            Signing In...
          </>
        ) : (
          "Sign In"
        )}
      </Button>

      <Link to="/register" style={{ textDecoration: "none" }}>
        <Typography
          align="center"
          sx={{
            color: theme.colors.primaryLight,
            fontWeight: 500,
            fontSize: "15px",
            mt: 1,
            transition: "color 0.3s",
            "&:hover": {
              color: theme.colors.primary,
              textDecoration: "underline",
            },
          }}
        >
          Don't have an account? Register here
        </Typography>
      </Link>
    </Box>
  </Box>
</Container>
    </Box>
  );
};

export default Login;
