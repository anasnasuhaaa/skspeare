"use client";

import React, { useState } from "react";
import Image from "next/image";
import {
  FaeOutfit,
  BASE_BODY_ASSET,
  FAE_CONTOH_ASSET,
  HAIR_OPTIONS,
  DRESS_OPTIONS,
  ACCESSORY_OPTIONS,
  WINGS_OPTIONS,
  PET_OPTIONS,
} from "./fairyTypes";

interface FaeCharacterProps {
  outfit: FaeOutfit;
  className?: string;
  priority?: boolean;
  animate?: boolean;
  altText?: string;
  onLayerLoaded?: () => void;
}

export default function FaeCharacter({
  outfit,
  className = "",
  priority = false,
  animate = true,
  altText = "Fae Luminelle, Whimsical Fairy",
  onLayerLoaded,
}: FaeCharacterProps) {
  // Graceful layer failure fallbacks
  const [failedLayers, setFailedLayers] = useState<Record<string, boolean>>({});

  const handleImageError = (layerKey: string) => {
    setFailedLayers((prev) => ({ ...prev, [layerKey]: true }));
  };

  // If dress-up was skipped, render FaeContoh as the fallback appearance
  if (!outfit.isCustom) {
    return (
      <div
        className={`relative aspect-square w-full select-none overflow-visible ${
          animate ? "fae-float-animation" : ""
        } ${className}`}
        aria-label={altText}
      >
        <style>{`
          @keyframes faeFloat {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-7px); }
          }
          @media (prefers-reduced-motion: no-preference) {
            .fae-float-animation {
              animation: faeFloat 4.5s ease-in-out infinite;
            }
          }
        `}</style>
        <Image
          src={FAE_CONTOH_ASSET}
          alt={altText}
          fill
          priority={priority}
          sizes="(max-width: 640px) 90vw, (max-width: 1024px) 50vw, 600px"
          className="object-contain drop-shadow-[0_10px_25px_rgba(255,182,193,0.35)]"
          onLoad={onLayerLoaded}
        />
      </div>
    );
  }

  // Resolve active asset configurations
  const activeHair =
    HAIR_OPTIONS.find((h) => h.id === outfit.hairId) || HAIR_OPTIONS[0];
  const activeDress =
    DRESS_OPTIONS.find((d) => d.id === outfit.dressId) || DRESS_OPTIONS[0];
  const activeAccessory = outfit.accessoryId
    ? ACCESSORY_OPTIONS.find((a) => a.id === outfit.accessoryId)
    : null;
  const activeWings =
    WINGS_OPTIONS.find((w) => w.id === outfit.wingsId) || WINGS_OPTIONS[0];
  const activePet = outfit.petId
    ? PET_OPTIONS.find((p) => p.id === outfit.petId)
    : null;

  // Hair 1 has distinct behind and front layers
  const isHair1 = activeHair.id === "hair-1";
  const hairBehindPath = isHair1 ? activeHair.layerBehind : undefined;
  const hairFrontPath = isHair1 ? activeHair.layerFront : activeHair.layerPath;

  // Offsets relative to Body coordinate system
  const wingsOffsetY = activeWings.offsetY || "0%";

  return (
    <div
      className={`relative aspect-square w-full select-none overflow-visible ${
        animate ? "fae-float-animation" : ""
      } ${className}`}
      aria-label={altText}
    >
      <style>{`
        @keyframes faeFloat {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(0px); }
        }
        @media (prefers-reduced-motion: no-preference) {
          .fae-float-animation {
            animation: faeFloat 4.5s ease-in-out infinite;
          }
        }
      `}</style>

      {/* ============================================================
          1. WINGS (z-10 — BEHIND EVERYTHING)
          Originates from Fae's back/shoulders
          ============================================================ */}
      {activeWings?.layerPath && !failedLayers["wings"] && (
        <div
          className="absolute inset-0 z-10 pointer-events-none transition-transform duration-300"
          style={{ transform: `translateY(${wingsOffsetY})` }}
        >
          <Image
            src={activeWings.layerPath}
            alt={activeWings.name}
            fill
            priority={priority}
            sizes="(max-width: 640px) 90vw, (max-width: 1024px) 50vw, 600px"
            className="object-contain drop-shadow-[0_0_20px_rgba(255,223,137,0.45)]"
            onError={() => handleImageError("wings")}
          />
        </div>
      )}

      {/* ============================================================
          2. HAIR 1 - BEHIND (z-20 — BEHIND BODY, ONLY FOR HAIR 1)
          Cascades down behind the body and over wings
          ============================================================ */}
      {hairBehindPath && !failedLayers["hair-behind"] && (
        <div
          className="absolute inset-0 z-20 pointer-events-none"
        >
          <Image
            src={hairBehindPath}
            alt={`${activeHair.name} (Back)`}
            fill
            priority={priority}
            sizes="(max-width: 640px) 90vw, (max-width: 1024px) 50vw, 600px"
            className="object-contain"
            onError={() => handleImageError("hair-behind")}
          />
        </div>
      )}

      {/* ============================================================
          3. BASE BODY (z-30 — MASTER COORDINATE REFERENCE)
          Permanent base layer defining the character space
          ============================================================ */}
      {!failedLayers["body"] && (
        <div className="absolute inset-0 z-30 pointer-events-none">
          <Image
            src={BASE_BODY_ASSET}
            alt="Fae Luminelle Base Body"
            fill
            priority={priority}
            sizes="(max-width: 640px) 90vw, (max-width: 1024px) 50vw, 600px"
            className="object-contain drop-shadow-[0_8px_20px_rgba(0,0,0,0.15)]"
            onError={() => handleImageError("body")}
            onLoad={onLayerLoaded}
          />
        </div>
      )}

      {/* ============================================================
          4. DRESS (z-40 — OVER BODY TORSO)
          Directly wraps Fae's torso, shoulders, and waist
          ============================================================ */}
      {activeDress?.layerPath && !failedLayers["dress"] && (
        <div className="absolute inset-0 z-40 pointer-events-none">
          <Image
            src={activeDress.layerPath}
            alt={activeDress.name}
            fill
            priority={priority}
            sizes="(max-width: 640px) 90vw, (max-width: 1024px) 50vw, 600px"
            className="object-contain"
            onError={() => handleImageError("dress")}
          />
        </div>
      )}

      {/* ============================================================
          5. HAIR FRONT (z-50 — OVER BODY & DRESS)
          Aligned to Fae's head, forehead, and face
          ============================================================ */}
      {hairFrontPath && !failedLayers["hair-front"] && (
        <div
          className="absolute inset-0 z-50 pointer-events-none"
        >
          <Image
            src={hairFrontPath}
            alt={activeHair.name}
            fill
            priority={priority}
            sizes="(max-width: 640px) 90vw, (max-width: 1024px) 50vw, 600px"
            className="object-contain"
            onError={() => handleImageError("hair-front")}
          />
        </div>
      )}

      {/* ============================================================
          6. HAIR ACCESSORY (z-60 — ON HEAD / HAIR)
          Sits properly on top of the hairstyle and forehead
          ============================================================ */}
      {activeAccessory?.layerPath && !failedLayers["accessory"] && (
        <div
          className="absolute inset-0 z-60 pointer-events-none"
        >
          <Image
            src={activeAccessory.layerPath}
            alt={activeAccessory.name}
            fill
            priority={priority}
            sizes="(max-width: 640px) 90vw, (max-width: 1024px) 50vw, 600px"
            className="object-contain drop-shadow-[0_0_12px_rgba(255,255,255,0.6)]"
            onError={() => handleImageError("accessory")}
          />
        </div>
      )}

      {/* ============================================================
          7. PET (z-70 — AT LOWER-RIGHT SIDE OF FAE)
          Accompanying companion positioned at lower-right without covering Fae
          ============================================================ */}
      {activePet?.layerPath && !failedLayers["pet"] && (
        <div className="absolute bottom-[-2%] right-[-2%] w-[46%] h-[46%] z-70 pointer-events-none transition-all duration-300">
          <div className="relative w-full h-full">
            <Image
              src={activePet.layerPath}
              alt={activePet.name}
              fill
              priority={priority}
              sizes="(max-width: 640px) 45vw, 250px"
              className="object-contain drop-shadow-[0_6px_16px_rgba(0,0,0,0.25)]"
              onError={() => handleImageError("pet")}
            />
          </div>
        </div>
      )}
    </div>
  );
}
