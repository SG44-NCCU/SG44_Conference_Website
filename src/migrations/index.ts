import * as migration_20260326_152612_full_paper_feature from './20260326_152612_full_paper_feature';
import * as migration_20260330_135759_add_certification_fields from './20260330_135759_add_certification_fields';
import * as migration_20260407_052715 from './20260407_052715';
import * as migration_20260407_062249 from './20260407_062249';

export const migrations = [
  {
    up: migration_20260326_152612_full_paper_feature.up,
    down: migration_20260326_152612_full_paper_feature.down,
    name: '20260326_152612_full_paper_feature',
  },
  {
    up: migration_20260330_135759_add_certification_fields.up,
    down: migration_20260330_135759_add_certification_fields.down,
    name: '20260330_135759_add_certification_fields',
  },
  {
    up: migration_20260407_052715.up,
    down: migration_20260407_052715.down,
    name: '20260407_052715',
  },
  {
    up: migration_20260407_062249.up,
    down: migration_20260407_062249.down,
    name: '20260407_062249'
  },
];
