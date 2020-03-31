export class DateTimeConverter {
  private format: string;
  private date: Date;

  get formattedDate(): string {
    const padStart = (value: number): string => value.toString().padStart(2, '0');

    return this.format
      .replace(/yyyy/g, padStart(this.date.getFullYear()))
      .replace(/dd/g, padStart(this.date.getDate()))
      .replace(/mm/g, padStart(this.date.getMonth() + 1))
      .replace(/hh/g, padStart(this.date.getHours()))
      .replace(/ii/g, padStart(this.date.getMinutes()))
      .replace(/ss/g, padStart(this.date.getSeconds()));
  }

  isValidDate(d: Date): boolean {
    return !isNaN(d.getTime());
  }

  constructor(format: string, date?: string) {
    if (date) {
      this.date = new Date(date);
      if (!this.isValidDate(this.date)) {
        this.date = new Date();
      }
    } else {
      this.date = new Date();
    }
    this.format = format;
  }
}
