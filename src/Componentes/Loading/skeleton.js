import React from "react";
import { Skeleton, Box, Stack, Container } from "@mui/material";

const skeletonTypes = {
  banner: ({ height = 3, width = 12 }) => (
    <Skeleton
      variant="rectangular"
      height={height * 16}
      width={`${(width / 12) * 100}%`}
      sx={{ borderRadius: "10px", overflow: "hidden" }}
    />
  ),
  profile: ({ size = 64 }) => (
    <Skeleton variant="circular" width={size} height={size} />
  ),
  profile_info: () => (
    <Stack direction="row" spacing={2} alignItems="center">
      <Skeleton variant="circular" width={64} height={64} />
      <Box>
        <Skeleton
          variant="text"
          width={120}
          height={28}
          sx={{ borderRadius: "10px" }}
        />
        <Skeleton
          variant="text"
          width={80}
          height={20}
          sx={{ borderRadius: "10px" }}
        />
      </Box>
    </Stack>
  ),
  item_list: ({ count = 3 }) => (
    <Stack spacing={2}>
      {Array.from({ length: count }).map((_, i) => (
        <Skeleton
          key={i}
          variant="rectangular"
          sx={{ borderRadius: "10px", overflow: "hidden" }}
          height={40}
          width="100%"
        />
      ))}
    </Stack>
  ),
};

function parseSkeletonType(typeString) {
  const [type, param1, param2] = typeString.split("_");

  switch (type) {
    case "banner":
      return {
        type,
        height: Number(param1) || 3,
        width: Number(param2) || 12,
      };
    case "item":
      return { type: "item_list", count: Number(param1) || 3 };
    case "profile":
      return { type: "profile", size: Number(param1) || 64 };
    case "profileinfo":
      return { type: "profile_info" };
    default:
      return { type: "banner", height: 3, width: 12 };
  }
}

export default function CustomSkeleton({ size = "xs", items = [] }) {
  return (
    <Container
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 2,
      }}
      maxWidth={size}
    >
      {items.map((item, idx) => {
        const { type, ...props } = parseSkeletonType(item);
        const SkeletonComponent = skeletonTypes[type];
        return (
          <Box key={idx}>
            {SkeletonComponent ? <SkeletonComponent {...props} /> : null}
          </Box>
        );
      })}
    </Container>
  );
}
