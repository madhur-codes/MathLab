import React, { useState, useMemo } from "react";
import { ArrowRightLeft, Sparkles, Copy, Check } from "lucide-react";

interface UnitCategory {
  name: string;
  units: Record<string, number>; // Factor relative to standard base unit
}

const UNIT_CATEGORIES: Record<string, UnitCategory> = {
  length: {
    name: "Length",
    units: {
      "Meter (m)": 1,
      "Kilometer (km)": 1000,
      "Centimeter (cm)": 0.01,
      "Millimeter (mm)": 0.001,
      "Mile (mi)": 1609.344,
      "Yard (yd)": 0.9144,
      "Foot (ft)": 0.3048,
      "Inch (in)": 0.0254,
      "Nautical Mile": 1852,
    },
  },
  mass: {
    name: "Mass / Weight",
    units: {
      "Kilogram (kg)": 1,
      "Gram (g)": 0.001,
      "Milligram (mg)": 0.000001,
      "Metric Ton (t)": 1000,
      "Pound (lb)": 0.45359237,
      "Ounce (oz)": 0.02834952,
    },
  },
  area: {
    name: "Area",
    units: {
      "Square Meter (m²)": 1,
      "Square Kilometer (km²)": 1000000,
      "Hectare (ha)": 10000,
      "Acre (ac)": 4046.856,
      "Square Foot (ft²)": 0.092903,
      "Square Inch (in²)": 0.00064516,
    },
  },
  volume: {
    name: "Volume",
    units: {
      "Liter (L)": 1,
      "Milliliter (mL)": 0.001,
      "Cubic Meter (m³)": 1000,
      "Gallon (US gal)": 3.78541,
      "Fluid Ounce (fl oz)": 0.0295735,
    },
  },
  time: {
    name: "Time",
    units: {
      "Second (s)": 1,
      "Millisecond (ms)": 0.001,
      "Minute (min)": 60,
      "Hour (hr)": 3600,
      "Day (d)": 86400,
      "Week (wk)": 604800,
      "Year (yr)": 31536000,
    },
  },
  speed: {
    name: "Speed",
    units: {
      "Meters / sec (m/s)": 1,
      "Kilometers / hr (km/h)": 0.277778,
      "Miles / hr (mph)": 0.44704,
      "Knot (kn)": 0.514444,
    },
  },
  digital: {
    name: "Digital Storage",
    units: {
      "Byte (B)": 1,
      "Kilobyte (KB)": 1024,
      "Megabyte (MB)": 1048576,
      "Gigabyte (GB)": 1073741824,
      "Terabyte (TB)": 1099511627776,
    },
  },
};

export const UnitsModule: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<string>("length");
  const [val, setVal] = useState<number>(100);
  const [fromUnit, setFromUnit] = useState<string>("Meter (m)");
  const [toUnit, setToUnit] = useState<string>("Foot (ft)");

  // Temperature special state
  const [tempVal, setTempVal] = useState<number>(100);
  const [tempFrom, setTempFrom] = useState<"C" | "F" | "K">("C");
  const [tempTo, setTempTo] = useState<"C" | "F" | "K">("F");

  const [copied, setCopied] = useState<boolean>(false);

  // Standard category change
  const handleCategoryChange = (catKey: string) => {
    setActiveCategory(catKey);
    if (catKey !== "temperature") {
      const units = Object.keys(UNIT_CATEGORIES[catKey].units);
      setFromUnit(units[0]);
      setToUnit(units[1] || units[0]);
    }
  };

  // Standard conversion
  const convertedValue = useMemo(() => {
    if (activeCategory === "temperature") return 0;
    const cat = UNIT_CATEGORIES[activeCategory];
    if (!cat) return 0;
    const fromFactor = cat.units[fromUnit] || 1;
    const toFactor = cat.units[toUnit] || 1;
    const inBase = val * fromFactor;
    return inBase / toFactor;
  }, [activeCategory, val, fromUnit, toUnit]);

  // Temperature conversion
  const convertedTemp = useMemo(() => {
    let inCelsius = tempVal;
    if (tempFrom === "F") inCelsius = ((tempVal - 32) * 5) / 9;
    if (tempFrom === "K") inCelsius = tempVal - 273.15;

    if (tempTo === "C") return inCelsius;
    if (tempTo === "F") return (inCelsius * 9) / 5 + 32;
    if (tempTo === "K") return inCelsius + 273.15;
    return inCelsius;
  }, [tempVal, tempFrom, tempTo]);

  const swapUnits = () => {
    if (activeCategory === "temperature") {
      const t = tempFrom;
      setTempFrom(tempTo);
      setTempTo(t);
    } else {
      const t = fromUnit;
      setFromUnit(toUnit);
      setToUnit(t);
    }
  };

  const copyResult = () => {
    const text =
      activeCategory === "temperature"
        ? `${convertedTemp.toFixed(4)} °${tempTo}`
        : `${convertedValue.toFixed(4)} ${toUnit}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800/80 pb-4">
        <div>
          <div className="flex items-center space-x-3">
            <h2 className="text-xl font-bold text-white tracking-tight">Engineering Unit Converter</h2>
            <span className="text-xs font-mono px-2.5 py-1 rounded-md bg-slate-800/90 border border-slate-700 text-slate-300 font-medium">
              Head of Project: Madhur
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Standard STEM engineering conversions with normalized base-unit scaling.
          </p>
        </div>
      </div>

      {/* Categories Bar */}
      <div className="flex items-center space-x-1.5 overflow-x-auto pb-1">
        {Object.entries(UNIT_CATEGORIES).map(([key, cat]) => (
          <button
            key={key}
            onClick={() => handleCategoryChange(key)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
              activeCategory === key
                ? "bg-[#00D4FF] text-slate-950 font-bold"
                : "bg-[#0E1526] hover:bg-slate-800 text-slate-300 border border-slate-800"
            }`}
          >
            {cat.name}
          </button>
        ))}
        <button
          onClick={() => setActiveCategory("temperature")}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
            activeCategory === "temperature"
              ? "bg-[#00D4FF] text-slate-950 font-bold"
              : "bg-[#0E1526] hover:bg-slate-800 text-slate-300 border border-slate-800"
          }`}
        >
          Temperature (°C, °F, K)
        </button>
      </div>

      {/* Conversion Card */}
      <div className="bg-[#0E1526] border border-slate-800 rounded-xl p-6 shadow-xl space-y-6">
        {activeCategory !== "temperature" ? (
          <div className="grid grid-cols-1 md:grid-cols-11 gap-4 items-center">
            {/* Input Value & Unit */}
            <div className="md:col-span-5 space-y-2">
              <label className="text-xs font-mono text-cyan-400 uppercase font-bold block">From Value & Unit:</label>
              <input
                type="number"
                value={val}
                onChange={(e) => setVal(parseFloat(e.target.value) || 0)}
                className="w-full bg-[#151E34] border border-slate-700 rounded-lg p-3 text-white font-mono text-lg focus:border-cyan-400 focus:outline-none"
              />
              <select
                value={fromUnit}
                onChange={(e) => setFromUnit(e.target.value)}
                className="w-full bg-[#151E34] border border-slate-700 rounded-lg p-2.5 text-xs text-white font-mono focus:border-cyan-400 focus:outline-none cursor-pointer"
              >
                {Object.keys(UNIT_CATEGORIES[activeCategory].units).map((u) => (
                  <option key={u} value={u}>
                    {u}
                  </option>
                ))}
              </select>
            </div>

            {/* Swap Button */}
            <div className="md:col-span-1 flex justify-center">
              <button
                onClick={swapUnits}
                className="p-3 rounded-full bg-[#151E34] hover:bg-slate-800 border border-slate-700 text-cyan-400 hover:text-white transition-colors cursor-pointer"
                title="Swap Units"
              >
                <ArrowRightLeft className="w-4 h-4" />
              </button>
            </div>

            {/* Target Value & Unit */}
            <div className="md:col-span-5 space-y-2">
              <label className="text-xs font-mono text-emerald-400 uppercase font-bold block">Converted Output:</label>
              <div className="w-full bg-[#151E34] border border-slate-700 rounded-lg p-3 text-emerald-400 font-mono text-lg font-bold truncate">
                {Number.isInteger(convertedValue) ? convertedValue : convertedValue.toFixed(4)}
              </div>
              <select
                value={toUnit}
                onChange={(e) => setToUnit(e.target.value)}
                className="w-full bg-[#151E34] border border-slate-700 rounded-lg p-2.5 text-xs text-white font-mono focus:border-cyan-400 focus:outline-none cursor-pointer"
              >
                {Object.keys(UNIT_CATEGORIES[activeCategory].units).map((u) => (
                  <option key={u} value={u}>
                    {u}
                  </option>
                ))}
              </select>
            </div>
          </div>
        ) : (
          /* Temperature Mode */
          <div className="grid grid-cols-1 md:grid-cols-11 gap-4 items-center">
            <div className="md:col-span-5 space-y-2">
              <label className="text-xs font-mono text-cyan-400 uppercase font-bold block">Input Temperature:</label>
              <input
                type="number"
                value={tempVal}
                onChange={(e) => setTempVal(parseFloat(e.target.value) || 0)}
                className="w-full bg-[#151E34] border border-slate-700 rounded-lg p-3 text-white font-mono text-lg focus:border-cyan-400 focus:outline-none"
              />
              <div className="flex gap-2">
                {(["C", "F", "K"] as const).map((t) => (
                  <button
                    key={t}
                    onClick={() => setTempFrom(t)}
                    className={`flex-1 py-1.5 rounded font-mono text-xs font-bold ${
                      tempFrom === t ? "bg-[#00D4FF] text-slate-950" : "bg-[#151E34] text-slate-300"
                    }`}
                  >
                    °{t}
                  </button>
                ))}
              </div>
            </div>

            <div className="md:col-span-1 flex justify-center">
              <button
                onClick={swapUnits}
                className="p-3 rounded-full bg-[#151E34] hover:bg-slate-800 border border-slate-700 text-cyan-400 hover:text-white transition-colors cursor-pointer"
              >
                <ArrowRightLeft className="w-4 h-4" />
              </button>
            </div>

            <div className="md:col-span-5 space-y-2">
              <label className="text-xs font-mono text-emerald-400 uppercase font-bold block">Converted Output:</label>
              <div className="w-full bg-[#151E34] border border-slate-700 rounded-lg p-3 text-emerald-400 font-mono text-lg font-bold">
                {convertedTemp.toFixed(2)} °{tempTo}
              </div>
              <div className="flex gap-2">
                {(["C", "F", "K"] as const).map((t) => (
                  <button
                    key={t}
                    onClick={() => setTempTo(t)}
                    className={`flex-1 py-1.5 rounded font-mono text-xs font-bold ${
                      tempTo === t ? "bg-[#00D4FF] text-slate-950" : "bg-[#151E34] text-slate-300"
                    }`}
                  >
                    °{t}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        <div className="flex justify-end pt-2 border-t border-slate-800">
          <button
            onClick={copyResult}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded bg-[#151E34] hover:bg-slate-800 text-xs text-slate-200 border border-slate-700 transition-colors cursor-pointer"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? "Copied" : "Copy Result"}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
