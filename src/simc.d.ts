declare interface Dbc {
  // FIXME
  Live: {
    build_level: number;
    wow_version: string;
  };

  version_used: string;
}

declare interface SimOptions {
  debug: boolean;
  max_time: number;
  expected_iteration_time: number;
  vary_combat_length: number;
  iterations: number;
  target_error: number;
  threads: number;
  seed: number;
  single_actor_batch: boolean;
  queue_lag: number;
  queue_lag_stddev: number;
  gcd_lag: number;
  gcd_lag_stddev: number;
  channel_lag: number;
  channel_lag_stddev: number;
  queue_gcd_reduction: number;
  strict_gcd_queue: number;
  confidence: number;
  confidence_estimator: number;
  world_lag: number;
  world_lag_stddev: number;
  travel_variance: number;
  default_skill: number;
  reaction_time: number;
  regen_periodicity: number;
  ignite_sampling_delta: number;
  fixed_time: boolean;
  optimize_expressions: boolean;
  optimal_raid: number;
  log: number;
  debug_each: number;
  auto_ready_trigger: number;
  stat_cache: number;
  max_aoe_enemies: number;
  show_etmi: boolean;
  tmi_window_global: number;
  tmi_bin_size: number;
  enemy_death_pct: number;
  challenge_mode: boolean;
  timewalk: number;
  pvp_crit: boolean;
  rng: {
    name: string;
  };
  deterministic: number;
  average_range: number;
  average_gauss: number;
  fight_style: string;
  default_aura_delay: number;
  default_aura_delay_stddev: number;
  dbc: Dbc;
}

declare interface SimOverrides {
  mortal_wounds: number;
  bleeding: number;
  bloodlust: number;
  bloodlust_percent: number;
  bloodlust_time: number;
}

declare enum ActorRole {
  ATTACK,
  DPS,
  HEAL,
  HYBRID,
  SPELL,
  TANK
}

declare interface Talent {
  tier: number;
  id: number;
  spell_id: number;
  name: string;
}

declare interface ArtifactTrait {
  id: number;
  spell_id: number;
  name: string;
  total_rank: number;
  purchased_rank: number;
  crucible_rank: number;
  relic_rank: number;
}

declare interface SampleData {
  sum: number;
  count: number;
  mean: number;
}

declare interface ExtremaSampleData extends SampleData {
  min: number;
  max: number;
}

declare interface ExtendedSampleData extends ExtremaSampleData {
  median: number;
  variance: number;
  std_dev: number;
  mean_variance: number;
  mean_std_dev: number;
  distribution: number[];

  // Custom
  q1: number;
  q3: number;
}

declare interface TimelineData {
  mean: number;
  mean_std_dev: number;
  min: number;
  max: number;
  data: number[];
}

declare interface ActionSequenceAction {
  time: number;
  name: string;
  target: string;
  buffs: Array<{
    name: string;
    stacks: number;
  }>;
  resources: {
    [resourceName: string]: number;
  };
  resources_max: {
    [resourceName: string]: number;
  };
}

declare interface BuffData {
  name: string;
  spell: number;
  start_count: number;
  refresh_count: number;
  interval: number;
  trigger: number;
  uptime: number;
  benefit: number;
  overflow_stacks: number;
  overflow_total: number;
}

declare interface ProcData {
  name: string;
  interval: number;
  count: number;
}

declare interface GainData {
  name: string;

  // FIXME
  mana: {
    actual: number;
    overflow: number;
    count: number;
  };
}

declare interface ActionStat {
  name: string;
  school: string;
  type: string;
  num_executes: SampleData;
  portion_aps: ExtremaSampleData;
  portion_apse: ExtremaSampleData;
  portion_amount: number;
  actual_amount: ExtremaSampleData;
  total_amount: ExtremaSampleData;
  total_intervals: SampleData;
  num_direct_results: SampleData;
  direct_results: {
    [resultType: string]: {
      actual_amount: ExtremaSampleData;
      avg_actual_amount: ExtremaSampleData;
      total_amount: SampleData;
      fight_actual_amount: SampleData;
      fight_total_amount: SampleData;
      overkill_pct: SampleData;
      count: SampleData;
      pct: number;
    };
  };
}

declare interface GearPiece {
  name: string;
  encoded_item: string;
  ilevel: number;
  stamina?: number;
  agility?: number;
  intellect?: number;
  strength?: number;
  crit_rating?: number;
  haste_rating?: number;
  mastery_rating?: number;
  versatility_rating?: number;
}

declare interface Actor {
  name: string;
  race: string;
  level: number;
  role: ActorRole;
  specialization: string;
  talents: Talent[];
  artifact: ArtifactTrait[];
  party: number;
  ready_type: number;
  bugs: boolean;
  scale_player: boolean;
  potion_used: boolean;
  timeofday: 'DAY_TIME' | 'NIGHT_TIME';
  invert_scaling: number;
  reaction_offset: number;
  reaction_max: number;
  reaction_mean: number;
  reaction_stddev: number;
  reaction_nu: number;
  world_lag: number;
  brain_lag: number;
  brain_lag_stddev: number;
  world_lag_override: boolean;
  world_lag_stddev_override: boolean;
  dbc: Dbc;
  collected_data: {
    fight_length: ExtendedSampleData;
    waiting_time: ExtremaSampleData;
    executed_foreground_actions: ExtremaSampleData;
    dmg: ExtremaSampleData;
    compound_dmg: ExtremaSampleData;
    timeline_dmg: TimelineData;
    dps: ExtendedSampleData;
    dpse: ExtendedSampleData;
    resource_lost: {
      [resourceName: string]: SampleData;
    };
    combat_end_resource: {
      [resourceName: string]: ExtremaSampleData;
    };
    resource_timelines: {
      [resourceName: string]: TimelineData;
    };
    action_sequence_precombat: ActionSequenceAction[];
    action_sequence: ActionSequenceAction[];
    buffed_stats: {
      attribute: {
        [attributeName: string]: number;
      };
      resources: {
        [resourceName: string]: number;
      };
      stats: {
        spell_power: number;
        spell_crit: number;
        attack_crit: number;
        spell_haste: number;
        attack_haste: number;
        spell_speed: number;
        attack_speed: number;
        mastery_value: number;
        damage_versatility: number;
        heal_versatility: number;
        mitigation_versatility: number;
        speed: number;
        manareg_per_second: number;
        armor: number;
        dodge: number;
      };
    };
  };
  buffs: BuffData[];
  procs: ProcData[];
  gains: GainData[];
  stats: ActionStat[];
  gear: {
    [slotName: string]: GearPiece;
  };
}

declare interface RaidEvent {
  name: string;
  cooldown: number;
  cooldown_min: number;
  cooldown_max: number;
  duration: number;
  duration_min: number;
  duration_max: number;
  saved_duration: number;
}

declare interface JsonReport {
  version: number;
  ptr_enabled: number;
  build_date: string;
  build_time: string;
  git_revision: string;
  sim: {
    options: SimOptions;
    overrides: SimOverrides;
    players: Actor[];
    targets: Actor[];
    raid_events: RaidEvent[];
    statistics: {
      elapsed_cpu_seconds: number;
      elapsed_time_seconds: number;
      init_time_seconds: number;
      merge_time_seconds: number;
      analyze_time_seconds: number;
      simulation_length: ExtendedSampleData;
      raid_dps: SampleData;
      total_dmg: SampleData;
    };
  };
}
