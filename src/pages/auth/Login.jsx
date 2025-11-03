import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { loginStart, loginSuccess } from "../../store/slices/authSlice";
import { useAuth } from "../../hooks/useAuth";
import { storeAuthData } from "./authStorage";
import { theme } from "../../theme/theme";
import CompanyLogo from "../../assets/caerus-logo.png";
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

  const { login, isAuthenticated,user, loading, error } = useAuth();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const muiTheme = useMuiTheme();
  const isMobile = useMediaQuery(muiTheme.breakpoints.down("sm")); // Better than manual resize listener
  const isTablet = useMediaQuery(muiTheme.breakpoints.between("sm", "md"));
  useEffect(() => {
  if (isAuthenticated && user) {
    const isAdmin = user?.roles?.includes("ADMIN") || user?.role === "ADMIN";
    navigate(isAdmin ? "/admin-config" : "/task-management", { replace: true });
  }
}, [isAuthenticated, user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const success = await login(email, password);
    // console.log(useAuth);
    // if (success) {
    //   navigate("/home", { replace: true });
    // }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
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
        background: `linear-gradient(135deg, ${theme.colors.gray} 0%, ${theme.colors.background} 100%)`,
        p: isMobile ? 1 : 2,
        overflow: "auto",
      }}
    >
      <Container maxWidth="xs">
        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{
            backgroundColor: theme.colors.white,
            p: isMobile ? 2 : 4,
            borderRadius: theme.borderRadius.large,
            boxShadow: theme.shadows.large,
            transition: "transform 0.3s ease, box-shadow 0.3s ease",
            width: "100%",
            "&:hover": {
              transform: "scale(1.02)",
              boxShadow: theme.shadows.large.replace("0.23)", "0.3)"), // Slightly deeper shadow on hover
            },
          }}
        >
          {/* Header */}
          <Box
            sx={{
              textAlign: "center",
              mb: isMobile ? 2 : 3,
            }}
          >
            
            <Typography
              variant={isMobile ? "h5" : "h4"}
              sx={{
                color: theme.colors.primary,
                mb: 0.5,
                fontWeight: 700,
                letterSpacing: "0.5px",
              }}
            >
              {/* {COMPANY_INFO.name} */}
            </Typography>
            <Typography
              variant="body2"
              sx={{
                color: theme.colors.text.secondary,
                mb: 0,
                fontWeight: 400,
                letterSpacing: "0.3px",
              }}
            >
              {/* {COMPANY_INFO.description} */}
            </Typography>
          </Box>

          {/* Login Form */}
          <Box sx={{ display: "flex", flexDirection: "column", gap: isMobile ? 1.5 : 2 }}>
            {/* Email Input */}
            <TextField
              label="Email Address"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Enter your email"
              disabled={loading}
              required
              fullWidth
              variant="outlined"
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: theme.borderRadius.small,
                  backgroundColor: theme.colors.white,
                  "& fieldset": {
                    borderColor: theme.colors.lightGray,
                  },
                  "&:hover fieldset": {
                    borderColor: theme.colors.primary,
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: theme.colors.primary,
                    borderWidth: 2,
                  },
                },
                "& .MuiInputLabel-root": {
                  color: theme.colors.text.primary,
                  fontWeight: 500,
                  letterSpacing: "0.2px",
                  fontSize: { xs: "14px", sm: "18px" },
                },
                "& .MuiInputBase-input": {
                  fontSize: { xs: "14px", sm: "16px" },
                  color: theme.colors.text.primary,
                },
              }}
            />

            {/* Password Input */}
            <TextField
              label="Password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Enter your password"
              disabled={loading}
              required
              fullWidth
              variant="outlined"
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: theme.borderRadius.small,
                  backgroundColor: theme.colors.white,
                  "& fieldset": {
                    borderColor: theme.colors.lightGray,
                  },
                  "&:hover fieldset": {
                    borderColor: theme.colors.primary,
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: theme.colors.primary,
                    borderWidth: 2,
                  },
                },
                "& .MuiInputLabel-root": {
                  color: theme.colors.text.primary,
                  fontWeight: 500,
                  letterSpacing: "0.2px",
                  fontSize: { xs: "14px", sm: "18px" },
                },
                "& .MuiInputBase-input": {
                  fontSize: { xs: "14px", sm: "16px" },
                  color: theme.colors.text.primary,
                },
              }}
              InputProps={{
                endAdornment: (
                  <Button
                    onClick={togglePasswordVisibility}
                    disabled={loading}
                    sx={{
                      minWidth: "auto",
                      p: 0.5,
                      color: theme.colors.text.secondary,
                      "&:hover": { color: theme.colors.primary },
                    }}
                  >
                    {showPassword ? "Hide" : "Show"}
                  </Button>
                ),
              }}
            />

            {error && (
              <Alert
                severity="error"
                sx={{
                  mt: 1,
                  borderRadius: theme.borderRadius.small,
                  fontSize: { xs: "12px", sm: "14px" },
                  letterSpacing: "0.2px",
                  "& .MuiAlert-message": {
                    p: 1,
                  },
                }}
              >
                {error}
              </Alert>
            )}

            <Button
              type="submit"
              disabled={loading}
              fullWidth
              variant="contained"
              sx={{
                py: { xs: 1.5, sm: 1.75 },
                fontSize: { xs: "14px", sm: "16px" },
                fontWeight: 600,
                borderRadius: theme.borderRadius.medium,
                background: `linear-gradient(90deg, ${theme.colors.primary} 0%, ${theme.colors.primaryDark} 100%)`,
                boxShadow: theme.shadows.medium,
                opacity: loading ? 0.7 : 1,
                cursor: loading ? "not-allowed" : "pointer",
                transition: "transform 0.3s ease",
                letterSpacing: "0.5px",
                textTransform: "none",
                "&:hover": {
                  transform: "scale(1.02)",
                  boxShadow: theme.shadows.large,
                  backgroundColor: theme.colors.primaryDark,
                },
                "&:disabled": {
                  backgroundColor: theme.colors.text.disabled,
                },
              }}
            >
              {loading ? <CircularProgress size={20} color="inherit" sx={{ mr: 1 }} /> : null}
              {loading ? "Signing In..." : "Sign In"}
            </Button>
          </Box>

          {/* Demo Info */}
         
        </Box>
      </Container>
    </Box>
  );
};

export default Login;