import { IsArray, IsInt, IsOptional, IsString, ValidateNested } from 'class-validator';

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
  readonly sort;
}
