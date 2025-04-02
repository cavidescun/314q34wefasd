// src/application/services/materias-homologacion/materias-homologacion.service.ts
import { Injectable, Logger, HttpStatus, HttpException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as oracledb from 'oracledb';
import { MateriaPensum } from 'src/domain/materias/entity/materias.entity';
import { ConsultaMateriasDto } from 'src/domain/materias/dto/materias.dto';
import { MateriasResponseDto } from 'src/domain/materias/materia-response/dto/meteria-response.dto';
// import { getOracleConfig } from '../../../infrastructure/interface/common/database/database.config';

@Injectable()
export class MateriasHomologacionService {
  private readonly logger = new Logger(MateriasHomologacionService.name);
  private oracleConfig: any;

  constructor(private readonly configService: ConfigService) {

    this.oracleConfig = {
      user: configService.get<string>('ORACLE_USERNAME'),
      password: configService.get<string>('ORACLE_PASSWORD'),
      connectString: `(DESCRIPTION=(ADDRESS=(PROTOCOL=TCP)(HOST=${configService.get<string>('ORACLE_HOST')})))`
    };

  }
  async obtenerMateriasPorParametros(
    params: ConsultaMateriasDto,
  ): Promise<MateriasResponseDto> {
    let connection;

    try {

      connection = await oracledb.getConnection(this.oracleConfig);

      const query = `
        SELECT MP.COD_UNIDAD, MP.COD_PENSUM, MP.COD_MATERIA, MP.NUM_NIVEL, MP.NOM_MATERIA, MP.UNI_TEORICA 
        FROM SINU.SRC_MAT_PENSUM MP
        WHERE MP.COD_UNIDAD = :codUnidad
        AND MP.COD_PENSUM = :codPensum
        AND MP.NUM_NIVEL <= :semestre
        ORDER BY MP.NUM_NIVEL ASC
      `;

      const binds = {
        codUnidad: params.codUnidad,
        codPensum: params.codPensum,
        semestre: params.semestre,
      };

      const options = {
        autoCommit: true,
        outFormat: oracledb.OUT_FORMAT_OBJECT,
      };

      const result = await connection.execute(query, binds, options);
      const rows = result.rows || [];

      if (rows.length === 0) {
        this.logger.warn(
          'No se encontraron materias con los parámetros proporcionados',
        );

        return {
          success: true,
          message:
            'No se encontraron materias para los parámetros proporcionados',
          parametros: {
            codUnidad: params.codUnidad,
            codPensum: params.codPensum,
            semestre: params.semestre,
          },
          data: [],
        };
      }

      this.logger.log(`Se encontraron ${rows.length} materias`);

      const materias = rows.map(
        (row) =>
          new MateriaPensum({
            codUnidad: row.COD_UNIDAD,
            codPensum: row.COD_PENSUM,
            codMateria: row.COD_MATERIA,
            numNivel: row.NUM_NIVEL,
            nomMateria: row.NOM_MATERIA,
            uniTeorica: row.UNI_TEORICA,
          }),
      );

      return {
        success: true,
        message: 'Materias recuperadas exitosamente',
        parametros: {
          codUnidad: params.codUnidad,
          codPensum: params.codPensum,
          semestre: params.semestre,
        },
        data: materias,
      };
    } catch (error) {
      this.logger.error(
        `Error al consultar materias: ${error.message}`,
        error.stack,
      );
      throw new HttpException(
        {
          success: false,
          message: 'Error al consultar materias en la base de datos',
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    } finally {
      if (connection) {
        try {
          await connection.close();
        } catch (err) {
          this.logger.error('Error al cerrar la conexión a Oracle', err);
        }
      }
    }
  }
}
