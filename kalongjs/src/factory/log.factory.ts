import Logger from 'bunyan';
import { Writable } from 'stream';
import dateFormat from 'dateformat';
import colors from 'colors/safe';

const consoleOut = new Writable({objectMode: true})
consoleOut._write = (chunk, enc, next) => {
  let obj = JSON.parse(chunk.toString())
  
	if(obj.level == 50 || obj.level == 60)
		console.log(colors.red(`[${dateFormat(new Date(obj.time), 'dd-mm-yy HH:MM:ss')}] ERROR: ${obj.name}: ${obj.msg}`))
	else if(obj.level == 20)
		console.log(colors.cyan(`[${dateFormat(new Date(obj.time), 'dd-mm-yy HH:MM:ss')}] DEBUG: ${obj.name}: ${obj.msg} ${(!obj.entity ? '' : '\n' + JSON.stringify(obj.entity, null, '\t'))}`))
	else if(obj.level == 40)
		console.log(colors.yellow(`[${dateFormat(new Date(obj.time), 'dd-mm-yy HH:MM:ss')}] WARN: ${obj.name}: ${obj.msg}`))
	else if(obj.level == 10)
		console.log(colors.blue(`[${dateFormat(new Date(obj.time), 'dd-mm-yy HH:MM:ss')}] WARN: ${obj.name}: ${obj.msg}`))
	else
		console.log(`[${dateFormat(new Date(obj.time), 'dd-mm-yy HH:MM:ss')}] INFO: ${obj.name}: ${obj.msg} ${(!obj.entity ? '' : '\n' + JSON.stringify(obj.entity, null, '\t'))}`)

	next()
}

export class LogFactory
{
  static create(T:Function, level:'debug'|'trace'|'info'|'warn'|'error' = "debug"):Logger {
    return Logger.createLogger({
			name: T.name,
			stream: consoleOut,
      level: level,
      src: true
    })
  }
}