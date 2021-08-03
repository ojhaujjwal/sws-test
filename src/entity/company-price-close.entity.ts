import { Column, CreateDateColumn, Entity, PrimaryColumn } from 'typeorm';

@Entity({
  name: 'swsCompanyPriceClose',
})
export class CompanyPriceCloseEntity {
  @PrimaryColumn({
    type: 'date',
  })
  readonly date: Date;

  @PrimaryColumn({
    type: 'uuid',
    name: 'company_id',
  })
  readonly companyId: string;

  @Column({
    type: 'float',
  })
  readonly price: number;

  @CreateDateColumn({
    name: 'date_created',
  })
  readonly createdAt: Date;
}
