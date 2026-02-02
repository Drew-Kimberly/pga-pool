import { FieldFilterSchema } from '../../common/api/list/schema';

export class TournamentDateFieldFilter {
  static build() {
    return FieldFilterSchema.json({
      year: FieldFilterSchema.numeric().rule((s) => s.integer().min(1900).max(2100)),
      start: FieldFilterSchema.timestamp(),
      end: FieldFilterSchema.timestamp(),
    });
  }
}
