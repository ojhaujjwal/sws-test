import {
  IsArray,
  IsIn,
  IsInt,
  IsOptional,
  IsString,
  Max,
  ValidateNested,
} from 'class-validator';
import { SORT_FIELDS, SortTarget } from '../queries/find-companies.query';
import { Type } from 'class-transformer';

class Scores {
  @IsOptional()
  @IsInt()
  readonly health;

  @IsOptional()
  @IsInt()
  readonly value;

  @IsOptional()
  @IsInt()
  readonly past;

  @IsOptional()
  @IsInt()
  readonly future;
}

export class QueryCompaniesRequest {
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  readonly exchangeSymbols?: ReadonlyArray<string>;

  @ValidateNested()
  readonly scores: Scores;

  @IsOptional()
  @IsString()
  @IsIn([...SORT_FIELDS, ...SORT_FIELDS.map((field) => `-${field}`)])
  readonly sort: SortTarget;

  @IsOptional()
  @IsInt()
  @Type(() => Number)
  readonly page = 1;

  @IsOptional()
  @IsInt()
  @Type(() => Number)
  @Max(500)
  readonly perPage = 10;
}
