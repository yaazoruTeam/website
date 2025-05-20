import { useState } from "react";
import CountryButton from "./CountryButton";

const CountryList = () => {
  const [selectedCountry, setSelectedCountry] = useState<string>("");

  const countries = [
    { name: "ארצות הברית", flag: "/src/assets/us-flag.svg" },
    { name: "ישראל", flag: "/src/assets/israel-flag.svg" },
    { name: "אנגליה", flag: "/src/assets/england-flag.svg" },
  ];

  return (
    <div style={{ display: "flex", gap: 15, paddingTop: 20 }}>
      {countries.map((country) => (
        <CountryButton
          key={country.name}
          countryName={country.name}
          flagSrc={country.flag}
          selected={selectedCountry === country.name}
          onClick={() => setSelectedCountry(country.name)}
        />
      ))}
    </div>
  );
};

export default CountryList;
