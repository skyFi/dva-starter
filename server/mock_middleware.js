import { readFileSync } from 'fs';
import { join } from 'path';
import Mock, { Random } from 'mockjs';

const DELAY = 200;

export default function(req, res, next) {
  console.log('mock middleware!', req.url);

  switch (req.url) {
    case '/api/another':
    case '/api/todo':
      setTimeout(() => {
        let json = [];
        new Array(Random.natural(10, 20)).fill(0).map( () => {
          json.push({
            id: Random.integer(1, 100),
            name: Random.cname(),
          });
        });
        res.json(json);
      }, DELAY);
      break;
    default:
      next();
      break;
  }
}