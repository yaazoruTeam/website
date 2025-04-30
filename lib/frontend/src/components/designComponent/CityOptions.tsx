import React from "react";
import {
  Box,
  Typography,
  Paper,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";

interface CityOptionsProps {
  cities: string[];
  onCitySelect: (city: string) => void;
}

const CityOptions: React.FC<CityOptionsProps> = ({ cities, onCitySelect }) => {
  return (
    <Box
      sx={{
        gridArea: "1 / 1",
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Paper
        sx={{
          width: "100%",
          height: "100%",
          padding: "0 10px",
          p: 2,
          backgroundColor: "white",
          borderRadius: 4,
          border: "1px solid rgba(11, 57, 81, 0.36)",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          boxShadow: "none",
          gap: 1,
        }}
      >
        <Box
          sx={{
            width: "100%",
            py: 1.5,
            borderRadius: 1,
            display: "flex",
            justifyContent: "flex-end",
            alignItems: "center",
          }}
        >
          <Typography
            variant="body1"
            sx={{
              color: "#032B40",
              fontFamily: "Heebo",
              fontSize: 16,
              textAlign: "right",
            }}
          >
            עיר לקוח
          </Typography>
        </Box>

        <List
          sx={{
            width: "100%",
            overflowY: "scroll",
            height: 260,
            scrollbarWidth: "none",
            "&::-webkit-scrollbar": {
              display: "none",
            },
          }}
        >
          {cities.map((city, index) => (
            <ListItem
              key={index}
              sx={{
                py: 1.5,
                borderRadius: 1,
                display: "flex",
                justifyContent: "flex-end",
                cursor: "pointer",
              }}
              onClick={() => onCitySelect(city)}
            >
              <ListItemText
                primary={city}
                sx={{
                  textAlign: "right",
                  color: "#032B40",
                  fontFamily: "Heebo",
                  fontSize: 16,
                }}
              />
            </ListItem>
          ))}
        </List>
      </Paper>
    </Box>
  );
};

export default CityOptions;

// import React from "react";
// import {
//   Box,
//   Paper,
//   List,
//   ListItem,
//   ListItemText,
// } from "@mui/material";

// interface CityOptionsProps {
//   cities: string[];
//   onCitySelect: (city: string) => void;
// }

// const CityOptions: React.FC<CityOptionsProps> = ({ cities, onCitySelect }) => {
//   return (
//     <Paper
//       sx={{
//         width: "100%", // חשוב! כדי שיירש מה־Box העוטף אותו ב־Popper
//         p: 2,
//         backgroundColor: "white",
//         borderRadius: 4,
//         border: "1px solid rgba(11, 57, 81, 0.36)",
//         display: "flex",
//         flexDirection: "column",
//         alignItems: "flex-start",
//         gap: 1,
//       }}
//     >
//       <List sx={{ width: "100%", overflowY: "auto", maxHeight: 260 }}>
//         {cities.map((city, index) => (
//           <ListItem
//             key={index}
//             sx={{
//               py: 1.5,
//               borderRadius: 1,
//               display: "flex",
//               justifyContent: "flex-end",
//               cursor: "pointer",
//               "&:hover": {
//                 backgroundColor: "#f0f0f0",
//               },
//             }}
//             onClick={() => onCitySelect(city)}
//           >
//             <ListItemText
//               primary={city}
//               sx={{
//                 textAlign: "right",
//                 color: "#032B40",
//                 fontFamily: "Heebo",
//                 fontSize: 16,
//               }}
//             />
//           </ListItem>
//         ))}
//       </List>
//     </Paper>
//   );
// };

// export default CityOptions;
