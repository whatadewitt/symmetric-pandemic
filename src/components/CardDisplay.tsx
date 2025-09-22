import React from "react";
import { PlayerCard } from "../types/cards";
import { CityImage } from "./CityImage";

interface CardDisplayProps {
  card: PlayerCard | null;
  isAnimating?: boolean;
  size?: "small" | "medium" | "large";
}

export const CardDisplay: React.FC<CardDisplayProps> = ({
  card,
  isAnimating,
  size = "large",
}) => {
  if (!card) {
    return (
      <div
        className={`${size === "large" ? "h-96" : size === "medium" ? "h-32" : "h-20"} flex items-center justify-center`}
      >
        <div
          className={`text-gray-500 ${size === "large" ? "text-xl" : "text-sm"}`}
        >
          {size === "large" ? "Draw a card to begin" : "No card"}
        </div>
      </div>
    );
  }

  const getSizeClasses = () => {
    switch (size) {
      case "small":
        return {
          container: "w-32 h-36",
          text: "text-sm",
          title: "text-xs",
          description: "text-xs",
          icon: "text-2xl",
        };
      case "medium":
        return {
          container: "w-32 h-20",
          text: "text-sm",
          title: "text-sm",
          description: "text-xs",
          icon: "text-2xl",
        };
      case "large":
      default:
        return {
          container: "w-96 h-96",
          text: "text-base",
          title: "text-2xl sm:text-3xl",
          description: "text-base sm:text-lg",
          icon: "text-6xl sm:text-8xl",
        };
    }
  };

  const sizeClasses = getSizeClasses();

  const getCardColor = () => {
    if (card.type === "epidemic") return "from-red-600 to-red-800";
    if (card.type === "event") return "from-pandemic-purple to-purple-800";
    if (card.type === "city") {
      switch (card.color) {
        case "red":
          return "from-pandemic-red to-red-700";
        case "blue":
          return "from-pandemic-blue to-blue-700";
        case "yellow":
          return "from-pandemic-yellow to-yellow-600";
        case "black":
          return "from-gray-900 to-black";
      }
    }
    return "from-gray-600 to-gray-800";
  };

  const getTextColor = () => {
    if (card.type === "city" && card.color === "yellow") return "text-gray-900";
    return "text-white";
  };

  return (
    <div
      className={`${size === "large" ? "h-96" : "h-auto"} flex items-center justify-center overflow-hidden`}
    >
      <div
        className={`relative ${sizeClasses.container} bg-gradient-to-br ${getCardColor()} rounded-xl shadow-2xl ${size === "large" ? "p-6" : size === "medium" ? "p-3" : "p-2"} ${getTextColor()} ${isAnimating ? "animate-card-slide" : ""}`}
      >
        {card.type === "city" && (
          <>
            <div className="text-center">
              {size === "large" ? (
                <>
                  <h2 className={`${sizeClasses.title} font-bold mb-4`}>
                    {card.name}
                  </h2>
                  <div className="w-full h-48 bg-black/20 rounded-lg mb-4 overflow-hidden">
                    <CityImage cityName={card.name} imagePath={card.image} />
                  </div>
                  <p className={`${sizeClasses.description} opacity-90`}>
                    Population: {card.population?.toLocaleString()}
                  </p>
                </>
              ) : (
                <>
                  <div className="w-full h-24 bg-black/20 rounded-lg mb-1 overflow-hidden">
                    <CityImage cityName={card.name} imagePath={card.image} />
                  </div>
                  <h2 className={`${sizeClasses.title} font-bold`}>
                    {card.name}
                  </h2>
                </>
              )}
            </div>
            <div
              className={`absolute ${size === "small" ? "top-1 right-1 w-2 h-2" : "top-3 right-3 w-4 h-4"} rounded-full bg-${card.color === "yellow" ? "yellow-400" : card.color === "red" ? "red-500" : card.color === "blue" ? "blue-500" : "gray-900"}`}
            />
          </>
        )}

        {card.type === "event" && (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <div
              className={`${sizeClasses.icon} ${size === "large" ? "mb-6" : "mb-1"}`}
            >
              ⚡
            </div>
            <h2
              className={`${sizeClasses.title} font-bold ${size === "large" ? "mb-4" : "mb-1"}`}
            >
              {card.name}
            </h2>
            {size === "large" && (
              <p
                className={`${sizeClasses.description} opacity-90 leading-relaxed`}
              >
                {card.description}
              </p>
            )}
          </div>
        )}

        {card.type === "epidemic" && (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <div
              className={`${sizeClasses.icon} ${size === "large" ? "mb-6" : "mb-1"} animate-pulse`}
            >
              ☠️
            </div>
            <h2
              className={`${sizeClasses.title} font-bold ${size === "large" ? "mb-2" : "mb-1"}`}
            >
              {size === "small" ? "EPI" : "EPIDEMIC!"}
            </h2>
            {size !== "small" && (
              <p className={`${sizeClasses.text}`}>{card.name}</p>
            )}
            {size === "large" && (
              <div className="mt-8 space-y-2 text-sm">
                <p>1. INCREASE infection rate</p>
                <p>2. INFECT bottom card city</p>
                <p>3. INTENSIFY (shuffle discard)</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
