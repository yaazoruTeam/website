import React from "react";
import { Button, Box } from "@mui/material";
import { colors } from "../../styles/theme";
import CustomTypography from "../designComponent/Typography";

interface CountryButtonProps {
  countryName: string;
  flagSrc: string;
  selected: boolean;
  onClick?: () => void;
}

const CountryButton: React.FC<CountryButtonProps> = ({
  countryName,
  flagSrc,
  selected,
  onClick,
}) => {
  return (
    <Button
      variant="outlined"
      onClick={onClick}
      sx={{
        borderRadius: "12px",
        padding: "8px 12px",
        textTransform: "none",
        display: "inline-flex",
        alignItems: "center",
        gap: 1,
        direction: "rtl",
        justifyContent: "flex-start",
        background: selected ? colors.c21 : "transparent",
        outline: selected ? `1px solid ${colors.c13}` : "none",
        outlineOffset: selected ? "-1px" : undefined,
        borderColor: selected ? colors.c13 : colors.c36,
        color: colors.c11,
        fontWeight: 400,
        fontSize: "14px",
        fontFamily: "Heebo",
      }}
    >
      <Box
        component="img"
        src={flagSrc}
        alt={`דגל ${countryName}`}
        sx={{ width: 20, height: 14, objectFit: "cover" }}
      />
      <CustomTypography text={countryName} weight="regular" variant="h5" color={colors.c11} sx={{fontSize: "14px"}}/>
    </Button>
  );
};

export default CountryButton;