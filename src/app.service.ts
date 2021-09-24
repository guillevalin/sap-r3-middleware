import { Injectable } from '@nestjs/common';
import * as noderfc from "node-rfc";
import { RfcConnectionParameters } from 'node-rfc';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }

  async test(): Promise<string> {
    try {
      // open connection
      const client = new noderfc.Client({ dest: "COTALKER_LAB" } as RfcConnectionParameters);
      await client.open();
  
      const createNotification: any = await client.call('BAPI_ALM_NOTIF_CREATE', {
        NOTIF_TYPE: 'M1',
        NOTIFHEADER: {
          PRIORITY: '1',
          SHORT_TEXT: 'Prueba desde integración',
          // EQUIPMENT: '',
          FUNCT_LOC: 'C-X'
        }
      });

      console.log(createNotification);

      const saveNotification: any = await client.call('BAPI_ALM_NOTIF_SAVE', {
        NUMBER: createNotification.NOTIFHEADER_EXPORT.NOTIF_NO.toString(),
      });

      console.log(saveNotification);

      const commitTransaction = await client.call('BAPI_TRANSACTION_COMMIT', {
        WAIT: 'X'
      });

      console.log(commitTransaction);

      console.log(`Se ha creado la notificación ${saveNotification.NOTIFHEADER.NOTIF_NO} con descripción ${saveNotification.NOTIFHEADER.SHORT_TEXT} con prioridad ${saveNotification.NOTIFHEADER.PRIORITY}`);

      await client.close();

      return saveNotification.NOTIFHEADER.NOTIF_NO;
    } catch (err) {
      // connection and invocation errors
      console.error(err);
      return 'Error';
    }
  }
}
