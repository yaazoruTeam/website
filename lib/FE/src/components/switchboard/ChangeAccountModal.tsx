import React from "react";
import {
  Dialog,
  DialogContent,
  Box,
  Typography,
  Button,
  Slide,
} from "@mui/material";
import { TransitionProps } from "@mui/material/transitions";
import { CustomTextField } from "../designComponent/Input";
import { useTranslation } from "react-i18next";
import { useForm } from "react-hook-form";
import CustomSelect from "../designComponent/CustomSelect";
import { colors } from "../../styles/theme";

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement;
  },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

interface ChangeAccountModalProps {
  open: boolean;
  onClose: () => void;
}

const ChangeAccountModal: React.FC<ChangeAccountModalProps> = ({
  open,
  onClose,
}) => {
  const { control } = useForm();
  const { t } = useTranslation();

  return (
    <Dialog
      open={open}
      onClose={onClose}
      TransitionComponent={Transition}
      keepMounted
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          boxShadow: "none",
          elevation: 0,
          outline: `1px solid ${colors.c22}`,
        },
      }}
      BackdropProps={{
        sx: {
          backgroundColor: colors.c22,
        },
      }}
    >
      <DialogContent
        sx={{
          p: "60px",
          backgroundColor: colors.c6,
          borderRadius: "4px",
        }}
      >
        <Box
          sx={{
            width: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            gap: "40px",
            direction: "rtl",
          }}
        >
          <Box
            sx={{
              alignSelf: "stretch",
              display: "flex",
              justifyContent: "flex-end",
              alignItems: "center",
              gap: "28px",
            }}
          >
            <Typography
              sx={{
                textAlign: "right",
                color: colors.c11,
                fontSize: "24px",
                fontFamily: "Heebo",
                fontWeight: 500,
                width: "100%",
              }}
            >
              החלף חשבון
            </Typography>
          </Box>
          <Box
            sx={{
              width: "100%",
              display: "flex",
              flexDirection: "column",
              gap: "24px",
            }}
          >
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-end",
                gap: 1,
              }}
            >
              <CustomTextField
                name="theCustomerName"
                label={t("theCustomerName")}
                rules={{
                  required: t("requiredField"),
                }}
                control={control}
              />
              <Box sx={{ width: "21.5px", height: "16px" }} />
            </Box>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-end",
                width: "100%",
                gap: 1,
              }}
            >
              <CustomSelect
                name="category"
                control={control}
                options={[
                  { label: "כנפי חיים", value: "1" },
                  { label: "כנפי חיים", value: "2" },
                  { label: "כנפי חיים", value: "3" },
                ]}
                label="בחרי קטגוריה"
                variant="changeAccount"
              />
            </Box>
          </Box>
          <Box
            sx={{
              display: "flex",
              gap: 1,
              justifyContent: "flex-end",
              width: "100%",
            }}
          >
            <Button
              variant="outlined"
              sx={{
                height: 50,
                borderRadius: "4px",
                borderColor: colors.c23,
                fontFamily: "Heebo",
                fontSize: "16px",
                textTransform: "none",
                color: colors.c2,
                px: 3,
                "&:hover": {
                  backgroundColor: colors.c35,
                },
              }}
              onClick={onClose}
            >
              מחיקה
            </Button>
            <Button
              variant="contained"
              sx={{
                height: 50,
                backgroundColor: colors.c2,
                borderRadius: "4px",
                fontFamily: "Heebo",
                fontSize: 16,
                textTransform: "none",
                color: "white",
                boxShadow: "none",
                px: 3,
                "&:hover": {
                  backgroundColor: colors.c34,
                },
              }}
            >
              החלף
            </Button>
          </Box>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default ChangeAccountModal;
