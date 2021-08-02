import { IsArray, IsOptional, IsString } from 'class-validator';

export class QueryCompaniesRequest {
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  readonly exchangeSymbols?: ReadonlyArray<string>;

  @IsOptional()
  readonly sort;
}
