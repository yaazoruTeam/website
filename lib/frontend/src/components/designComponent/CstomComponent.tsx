import React, { useRef, useEffect, useState } from "react";
import { Box, Paper, Button } from "@mui/material";

const CustomComponent: React.FC = () => {
  const topElementRef = useRef<HTMLDivElement | null>(null); // ref לאלמנט העליון
  const [position, setPosition] = useState({ top: 0, left: 0, width: 0 });

  useEffect(() => {
    if (topElementRef.current) {
      const rect = topElementRef.current.getBoundingClientRect();
      setPosition({
        top: rect.bottom + window.scrollY, // מיקום מתחת לאלמנט העליון
        left: rect.left + window.scrollX, // מיקום אופקי
        width: rect.width, // רוחב האלמנט העליון
      });
    }
  }, []);

  return (
    <Box sx={{ position: "relative" }}>
      {/* האלמנט העליון */}
      <Box
        ref={topElementRef}
        sx={{
          width: "200px",
          height: "50px",
          backgroundColor: "lightblue",
          border: "1px solid gray",
          borderRadius: "4px",
          padding: "10px",
        }}
      >
        אלמנט עליון
      </Box>

      {/* האלמנט התחתון */}
      <Paper
        elevation={3}
        sx={{
          position: "absolute",
          top: position.top, // מיקום אנכי
          left: position.left, // מיקום אופקי
          width: position.width, // התאמת הרוחב
          backgroundColor: "white",
          border: "1px solid gray",
          borderRadius: "4px",
          padding: "10px",
          zIndex: 10,
        }}
      >
        אלמנט תחתון
        <Box sx={{ display: "flex", gap: 2, marginTop: 2 }}>
          <Button variant="contained" color="success">
            פעיל
          </Button>
          <Button variant="contained" color="error">
            לא פעיל
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};

export default CustomComponent;