import { Injectable } from '@nestjs/common';
import * as noderfc from 'node-rfc';
import { RfcConnectionParameters } from 'node-rfc';

@Injectable()
export class AppService {
  private _client;

  constructor() {
    this._client = new noderfc.Client({
      dest: 'SAP_CLIENT',
    } as RfcConnectionParameters);
  }

  async goodsMovement(): Promise<any> {
    try {
      await this._client.open();

      const createMovement = await this._client.call('BAPI_GOODSMVT_CREATE', {
        GOODSMVT_HEADER: {
          PSTNG_DATE: '20240416',
          DOC_DATE: '20240416',
          REF_DOC_NO: 'REF_DOC_NO',
          HEADER_TXT: 'HEADER_TXT',
        },
        GOODSMVT_CODE: {
          GM_CODE: '01',
        },
        GOODSMVT_ITEM: [
          {
            MATERIAL: 'FIARCOS-CLA12170',
            PLANT: 'MAQ0',
            STGE_LOC: 'P004',
            BATCH: 'PRUEBA',
            MOVE_TYPE: '101',
            ENTRY_QNT: '10.000',
            ORDERID: '11000642',
            ORDER_ITNO: '0001',
            MVT_IND: 'F',
            PROD_DATE: '20240416',
          },
        ],
      });

      await this._client.close();

      return createMovement.RETURN;
    } catch (e) {
      console.error(e);
      return e;
    }
  }

  async createNotification(): Promise<any> {
    console.log('Called test function');
    try {
      await this._client.open();

      const createNotification: any = await this._client.call(
        'BAPI_ALM_NOTIF_CREATE',
        {
          NOTIF_TYPE: 'M1',
          NOTIFHEADER: {
            PRIORITY: '1',
            SHORT_TEXT: 'Prueba desde integración',
            // EQUIPMENT: '',
            FUNCT_LOC: 'C-X',
          },
        },
      );

      console.log(createNotification);

      const saveNotification: any = await this._client.call(
        'BAPI_ALM_NOTIF_SAVE',
        {
          NUMBER: createNotification.NOTIFHEADER_EXPORT.NOTIF_NO.toString(),
        },
      );

      console.log(saveNotification);

      const commitTransaction = await this._client.call(
        'BAPI_TRANSACTION_COMMIT',
        {
          WAIT: 'X',
        },
      );

      console.log(commitTransaction);

      console.log(
        `Se ha creado la notificación ${saveNotification.NOTIFHEADER.NOTIF_NO} con descripción ${saveNotification.NOTIFHEADER.SHORT_TEXT} con prioridad ${saveNotification.NOTIFHEADER.PRIORITY}`,
      );

      await this._client.close();

      return { createNotification, saveNotification };
    } catch (err) {
      // connection and invocation errors
      console.error(err);
      return err;
    }
  }
}
