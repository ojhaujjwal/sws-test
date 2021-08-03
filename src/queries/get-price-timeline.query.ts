export type TimelineItem = {
  readonly date: Date;
  readonly price: number;
};

export type Timeline = ReadonlyArray<Timeline>;

export class GetPriceTimelineQuery {
  readonly upto;

  constructor(readonly companyId: string, upto?: Date) {
    this.upto = upto ?? GetPriceTimelineQuery.getDefaultUpTo();
  }

  /**
   * Returns the default value of upto
   * 2 years before now
   */
  private static getDefaultUpTo(): Date {
    const oneYearFromNow = new Date();
    oneYearFromNow.setFullYear(oneYearFromNow.getFullYear() - 2);
    return oneYearFromNow;
  }
}
