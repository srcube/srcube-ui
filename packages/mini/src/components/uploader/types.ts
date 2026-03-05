export type UploaderFile = {
  id?: string | number;
  url: string;
  name?: string;
  size?: number;
  type?: string;
};

export type UploaderExceedDetail = {
  maxCount: number;
  acceptedCount: number;
  rejectedCount: number;
  currentCount: number;
};
