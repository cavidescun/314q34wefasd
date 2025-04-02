import {
  Injectable,
  Inject,
  Logger,
  HttpStatus,
  HttpException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as oracledb from 'oracledb';
import * as ExcelJS from 'exceljs';
import { EstudianteRepository } from 'src/domain/estudiante/repository/estudiante.repository';
import { HomologacionRepository } from 'src/domain/homologaciones/repository/homologacion.repository';

interface MateriaPensum {
  codUnidad: string;
  codPensum: string;
  codMateria: string;
  numNivel: string;
  nomMateria: string;
  uniTeorica: string;
}

@Injectable()
export class SenaHomologacionService {
  private readonly logger = new Logger(SenaHomologacionService.name);
  private oracleConfig: any;

  constructor(
    private readonly configService: ConfigService,
    @Inject('EstudianteRepository')
    private readonly estudianteRepository: EstudianteRepository,
    @Inject('HomologacionRepository')
    private readonly homologacionRepository: HomologacionRepository,
  ) {
    this.oracleConfig = {
      user: configService.get<string>('ORACLE_USERNAME'),
      password: configService.get<string>('ORACLE_PASSWORD'),
      connectString: `${configService.get<string>('ORACLE_HOST')}:${configService.get<number>('ORACLE_PORT')}/${configService.get<string>('ORACLE_SID')}`,
    };
  }

  async generarHomologacionExcel(
    numeroIdentificacion: string,
  ): Promise<Buffer> {
    let connection;
    try {
      const estudiante =
        await this.estudianteRepository.findByNumeroIdentificacion(
          numeroIdentificacion,
        );
      if (!estudiante) {
        throw new HttpException(
          `No se encontró un estudiante con número de identificación: ${numeroIdentificacion}`,
          HttpStatus.NOT_FOUND,
        );
      }
      const homologaciones =
        await this.homologacionRepository.findByEstudianteId(estudiante.id);

      if (!homologaciones || homologaciones.length === 0) {
        throw new HttpException(
          `No se encontraron homologaciones para el estudiante con ID: ${estudiante.id}`,
          HttpStatus.NOT_FOUND,
        );
      }

      const homologacion = homologaciones[0];

      if (
        !homologacion.codUnidad ||
        !homologacion.codPensum ||
        !homologacion.semestre
      ) {
        throw new HttpException(
          'El estudiante no tiene información académica completa (codUnidad, codPensum, semestre)',
          HttpStatus.BAD_REQUEST,
        );
      }

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
        codUnidad: homologacion.codUnidad,
        codPensum: homologacion.codPensum,
        semestre: homologacion.semestre,
      };

      const options = {
        autoCommit: true,
        outFormat: oracledb.OUT_FORMAT_OBJECT,
      };

      const result = await connection.execute(query, binds, options);
      const rows = result.rows || [];

      if (rows.length === 0) {
        throw new HttpException(
          'No se encontraron materias para la homologación',
          HttpStatus.NOT_FOUND,
        );
      }

      const materias: MateriaPensum[] = rows.map((row) => ({
        codUnidad: row.COD_UNIDAD,
        codPensum: row.COD_PENSUM,
        codMateria: row.COD_MATERIA,
        numNivel: row.NUM_NIVEL,
        nomMateria: row.NOM_MATERIA,
        uniTeorica: row.UNI_TEORICA,
      }));

      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet('Homologacion');

      worksheet.columns = [
        { header: 'CEDULA', key: 'cedula', width: 15 },
        { header: 'PROGRAMA', key: 'programa', width: 10 },
        { header: 'PENSUM', key: 'pensum', width: 10 },
        { header: 'MATERIA', key: 'materia', width: 10 },
        { header: 'PROG_EQUI', key: 'progEqui', width: 10 },
        { header: 'PEN_EQUI', key: 'penEqui', width: 10 },
        { header: 'CUR_EQUI', key: 'curEqui', width: 10 },
        { header: 'PERIODO', key: 'periodo', width: 10 },
        { header: 'TIPO - PER', key: 'tipoPer', width: 10 },
        { header: 'TIPO_NOTA', key: 'tipoNota', width: 10 },
        { header: 'PER - ACUMULA', key: 'perAcumula', width: 15 },
        { header: 'ESTADO MAT', key: 'estadoMat', width: 10 },
        { header: 'IND.ACUMULA', key: 'indAcumula', width: 15 },
        { header: 'DEFINITIVA', key: 'definitiva', width: 15 },
        { header: 'IND.APROBADA - N', key: 'indAprobadaN', width: 20 },
        { header: 'ALFA', key: 'alfa', width: 10 },
        { header: 'IND.APROBADA - A', key: 'indAprobadaA', width: 20 },
        { header: 'SEMESTRE', key: 'semestre', width: 10 },
        { header: 'HABILITACION', key: 'habilitacion', width: 15 },
        { header: 'OBSERVACION', key: 'observacion', width: 30 },
      ];

      const cedulaSinCerosIniciales = numeroIdentificacion.replace(/^0+/, '');
      materias.forEach((materia) => {
        const containsCunista = materia.nomMateria
          .toUpperCase()
          .includes('CUNISTA');
        const containsPractica =
          materia.nomMateria.toUpperCase().includes('PRACTICA') ||
          materia.nomMateria.toUpperCase().includes('PRÁCTICA');

        const indAcumula = containsCunista || containsPractica ? 0 : 1;
        const definitiva = containsCunista ? 5.0 : 4.5;
        const alfa = indAcumula === 0 ? 'A' : '';
        const indAprobadaA = indAcumula === 0 ? 1 : '';

        worksheet.addRow({
          cedula: cedulaSinCerosIniciales,
          programa: homologacion.codUnidad,
          pensum: homologacion.codPensum,
          materia: materia.codMateria,
          progEqui: '',
          penEqui: '',
          curEqui: '',
          periodo: homologacion.periodo,
          tipoPer: 'N',
          tipoNota: 'HE',
          perAcumula: homologacion.periodo,
          estadoMat: 1,
          indAcumula: indAcumula,
          definitiva: definitiva,
          indAprobadaN: 1,
          alfa: alfa,
          indAprobadaA: indAprobadaA,
          semestre: materia.numNivel,
          habilitacion: '',
          observacion: 'RECONOCIMIENTO DE TITULOS',
        });
      });

      const buffer = await workbook.xlsx.writeBuffer();
      return buffer as unknown as Buffer;
    } catch (error) {
      this.logger.error(
        `Error al generar homologación excel: ${error.message}`,
        error.stack,
      );

      if (error instanceof HttpException) {
        throw error;
      }

      throw new HttpException(
        {
          success: false,
          message: 'Error al generar excel de homologación',
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
