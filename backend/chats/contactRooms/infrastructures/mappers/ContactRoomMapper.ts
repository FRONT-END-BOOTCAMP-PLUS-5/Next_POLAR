import { ContactRoom } from '@/backend/chats/contactRooms/domains/entities/ContactRoom';

// DB Row 타입 정의
export interface ContactRoomDbRow {
  id: number;
  help_id: number | null;
  junior_id: string;
  senior_id: string;
  created_at: string;
}

export class ContactRoomMapper {
  // DB Row → Entity 변환 (단일)
  static toEntity(dbRow: ContactRoomDbRow): ContactRoom {
    return {
      contactRoomId: dbRow.id,
      helpId: dbRow.help_id || undefined,
      juniorId: dbRow.junior_id,
      seniorId: dbRow.senior_id,
      createdAt: dbRow.created_at,
    };
  }

  // DB Rows → Entities 변환 (배열)
  static toEntities(dbRows: ContactRoomDbRow[]): ContactRoom[] {
    return dbRows.map((row) => this.toEntity(row));
  }

  // Entity → DB Object 변환 (필요시)
  static toDbObject(
    entity: ContactRoom
  ): Omit<ContactRoomDbRow, 'id' | 'created_at'> {
    return {
      help_id: entity.helpId || null,
      junior_id: entity.juniorId,
      senior_id: entity.seniorId,
    };
  }
}
