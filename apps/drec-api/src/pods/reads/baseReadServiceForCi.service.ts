import {
  AggregatedReadDTO,
  FilterDTO,
  MeasurementDTO,
  ReadDTO,
  ReadsService,
} from '@energyweb/energy-api-influxdb';

type PublicPart<T> = { [K in keyof T]: T[K] };

/**
 * Implementation for CI which doesn't use Influx.
 * Add/correct methods as you need.
 */
export class BaseReadServiceForCi implements PublicPart<ReadsService> {
  private readings: { meterId: string; readings: ReadDTO[] }[] = [];

  public async aggregate(): Promise<AggregatedReadDTO[]> {
    return [];
  }

  public async find(meterId: string, filter: FilterDTO): Promise<ReadDTO[]> {
    return this.readings
      .filter((r) => r.meterId === meterId)
      .flatMap((r) => r.readings)
      .filter(
        (r) =>
          r.timestamp >= new Date(filter.start) &&
          r.timestamp <= new Date(filter.end),
      )
      .slice(filter.offset, filter.offset + filter.limit);
  }

  public async findDifference(): Promise<ReadDTO[]> {
    return [];
  }

  public async onModuleInit(): Promise<void> {}

  public async store(
    meterId: string,
    measurement: MeasurementDTO,
  ): Promise<void> {
    this.readings.push({
      meterId,
      readings: measurement.reads.map((r) => ({
        ...r,
        timestamp: new Date(r.timestamp),
      })),
    });
  }
}