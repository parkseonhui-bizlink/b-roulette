export interface Member {
  id: string;
  name: string;
  excluded: boolean;
  chatworkId?: string; // 선택적 필드
  excludedUntil?: Date | null; // 새로 추가된 필드
}
