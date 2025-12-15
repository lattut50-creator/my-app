 "use client";

import { useState } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  TextField,
  Typography,
} from "@mui/material";

export default function Page() {
  const [name, setName] = useState("");
  const [memory, setMemory] = useState("");
  const [wish, setWish] = useState(false);

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #ff9a9e 0%, #fad0c4 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        p: 2,
      }}
    >
      <Card sx={{ maxWidth: 500, width: "100%", borderRadius: 4 }}>
        <CardContent>
          {!wish ? (
            <>
              <Typography
                variant="h4"
                align="center"
                gutterBottom
                sx={{ fontWeight: "bold", color: "#d81b60" }}
              >
                Birthday Wish 💖
              </Typography>

              <TextField
                fullWidth
                label="Your Love's Name"
                variant="outlined"
                margin="normal"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />

              <TextField
                fullWidth
                label="A Special Memory or Reason You Love Them"
                variant="outlined"
                margin="normal"
                multiline
                rows={3}
                value={memory}
                onChange={(e) => setMemory(e.target.value)}
              />

              <Button
                fullWidth
                sx={{
                  mt: 2,
                  backgroundColor: "#d81b60",
                  ":hover": { backgroundColor: "#ad1457" },
                }}
                variant="contained"
                size="large"
                onClick={() => setWish(true)}
                disabled={!name}
              >
                Show Birthday Wish 🎂
              </Button>
            </>
          ) : (
            <>
              <Typography
                variant="h3"
                align="center"
                gutterBottom
                sx={{ fontWeight: "bold", color: "#d81b60" }}
              >
                Happy Birthday 🎉
              </Typography>

              <Typography
                variant="h4"
                align="center"
                sx={{ fontWeight: "bold", mb: 2 }}
              >
                My Love, {name} 💕
              </Typography>

              <Typography variant="body1" align="center" sx={{ mb: 2 }}>
                Today is not just your birthday — it is the day the world became
                more beautiful because **you were born**.
              </Typography>

              <Typography
                variant="body1"
                align="center"
                sx={{ fontStyle: "italic", mb: 2 }}
              >
                {memory
                  ? `"${memory}"`
                  : "You are my happiness, my peace, and my forever."}
              </Typography>

              <Typography variant="body1" align="center">
                May your life be filled with endless smiles, deep love, and all
                the dreams your heart holds. I am so grateful to love you and to
                walk this journey with you. 💖
              </Typography>

              <Typography
                variant="h6"
                align="center"
                sx={{ mt: 3, color: "#d81b60" }}
              >
                Forever yours 💘
              </Typography>

              <Button
                fullWidth
                sx={{ mt: 3 }}
                variant="outlined"
                onClick={() => setWish(false)}
              >
                Edit Message
              </Button>
            </>
          )}
        </CardContent>
      </Card>
    </Box>
  );
}
