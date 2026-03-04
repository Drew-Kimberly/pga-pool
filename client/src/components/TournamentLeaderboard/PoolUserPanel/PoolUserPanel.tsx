import { AccordionPanel, Box, ResponsiveContext, Text } from "grommet";
import { FormCheckmark, FormDown } from "grommet-icons";
import { useContext } from "react";

import { ParentComponentProps } from "../../types";
import { PlayerHeadshot } from "../PlayerHeadshot";
import { getScoreColor, toFedexCupPointsString, toScoreString } from "../utils";

import { getRoundStatus } from "./getRoundStatus";
import { StartDuration } from "./StartDuration";

import { PgaTournament, PoolTournamentUser } from "@drewkimberly/pga-pool-api";

export interface PoolUserPanelProps extends ParentComponentProps {
  user: PoolTournamentUser;
  pgaTournament: PgaTournament;
  scoringFormat: string;
  isOpen?: boolean;
  rank: string;
}

function CompactRoundStatus({
  roundStatus,
}: {
  roundStatus: ReturnType<typeof getRoundStatus>;
}) {
  if (roundStatus.status === "not_started") {
    return (
      <StartDuration
        time={roundStatus.teetimes[0] ?? null}
        size="xsmall"
        color="text-weak"
      />
    );
  }

  if (roundStatus.status === "in_progress") {
    return (
      <Text size="xsmall" color="text-weak">
        {roundStatus.percentComplete}%
      </Text>
    );
  }

  return (
    <Box direction="row" align="center" gap="xxsmall">
      <Text size="xsmall" color="text-weak">
        Complete
      </Text>
      <FormCheckmark color="var(--color-status-live)" size="small" />
    </Box>
  );
}

function HeadshotChips({
  user,
  size,
}: {
  user: PoolTournamentUser;
  size: number;
}) {
  return (
    <Box direction="row" gap="xsmall" align="center" justify="center">
      {user.picks.map((pick) => {
        const player = pick.pga_tournament_player;
        const isCut =
          player.current_position === "CUT" || player.status === "cut";
        const isWd = player.withdrawn || player.status === "wd";
        const hasStarted =
          isCut ||
          isWd ||
          player.active ||
          player.is_round_complete ||
          (player.score_thru ?? 0) > 0;

        return (
          <PlayerHeadshot
            key={player.id}
            src={player.pga_player.headshot_url}
            name={player.pga_player.name}
            size={size}
            badge={{
              score: player.score_total,
              isCut,
              isWithdrawn: isWd,
              hasStarted,
            }}
          />
        );
      })}
    </Box>
  );
}

function _PoolUserPanel({
  user,
  pgaTournament,
  scoringFormat,
  isOpen,
  rank,
}: Omit<PoolUserPanelProps, "children">) {
  const responsive = useContext(ResponsiveContext);
  const isDesktop = responsive !== "small";
  const roundStatus = getRoundStatus(
    user.picks.map((pick) => pick.pga_tournament_player),
    pgaTournament,
  );

  const isStrokes = scoringFormat === "strokes";
  const scoreDisplay = isStrokes
    ? toScoreString(user.score)
    : toFedexCupPointsString(user.fedex_cup_points);
  const scoreColor = isStrokes ? getScoreColor(user.score) : undefined;

  if (isDesktop) {
    return (
      <Box
        direction="row"
        align="center"
        pad={{ vertical: "small", horizontal: "small" }}
        gap="small"
      >
        {/* Left: Rank + Name/Status — fixed width for column alignment */}
        <Box
          direction="row"
          align="center"
          gap="small"
          width="200px"
          flex={false}
          style={{ minWidth: 0 }}
        >
          <Box
            width="28px"
            height="28px"
            round="full"
            background="rank-badge"
            align="center"
            justify="center"
            flex={false}
          >
            <Text size="xsmall" color="white" weight="bold">
              {rank}
            </Text>
          </Box>
          <Box style={{ minWidth: 0 }}>
            <Text weight="bold" size="medium" truncate>
              {user.user.nickname}
            </Text>
            <CompactRoundStatus roundStatus={roundStatus} />
          </Box>
        </Box>

        {/* Center: Headshot chips — larger on desktop */}
        <Box flex align="center" justify="center">
          <HeadshotChips user={user} size={40} />
        </Box>

        {/* Right: Score + Chevron */}
        <Box direction="row" align="center" gap="small" flex={false}>
          <Text
            weight="bold"
            size="xlarge"
            color={scoreColor}
            style={{
              fontFamily: "var(--font-display)",
              minWidth: "80px",
              textAlign: "right",
            }}
          >
            {scoreDisplay}
          </Text>
          <Box
            flex={false}
            style={{
              transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
              transition: "transform 0.2s ease",
            }}
          >
            <FormDown size="medium" color="text-weak" />
          </Box>
        </Box>
      </Box>
    );
  }

  // Mobile layout: stacked
  return (
    <Box pad={{ vertical: "small", horizontal: "small" }}>
      {/* Line 1: Rank + Nickname + Score + Chevron */}
      <Box direction="row" align="center" gap="small">
        <Box
          width="28px"
          height="28px"
          round="full"
          background="rank-badge"
          align="center"
          justify="center"
          flex={false}
        >
          <Text size="xsmall" color="white" weight="bold">
            {rank}
          </Text>
        </Box>

        <Box style={{ flex: 1, minWidth: 0 }}>
          <Text weight="bold" size="medium" truncate>
            {user.user.nickname}
          </Text>
          <CompactRoundStatus roundStatus={roundStatus} />
        </Box>

        <Text
          weight="bold"
          size="xlarge"
          color={scoreColor}
          style={{
            fontFamily: "var(--font-display)",
            minWidth: "fit-content",
          }}
        >
          {scoreDisplay}
        </Text>

        <Box
          flex={false}
          style={{
            transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
            transition: "transform 0.2s ease",
          }}
        >
          <FormDown size="medium" color="text-weak" />
        </Box>
      </Box>
    </Box>
  );
}

export function PoolUserPanel({ children, ...rest }: PoolUserPanelProps) {
  return (
    <AccordionPanel header={<_PoolUserPanel {...rest} />}>
      {children}
    </AccordionPanel>
  );
}
