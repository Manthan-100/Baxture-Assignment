import redis from "redis";

class dbConn {
	constructor() {
		this.redis;
	}

    connect = () => {
        this.redis = redis.createClient({ legacyMode: true });
        this.redis.connect();
        return new Promise((resolve, reject) => {
            this.redis.on("error", (err) => reject(err));
            this.redis.on("connect", () => resolve(this.redis));
        });
    }

    set = ({ key, data }) => {
        return this.redis.set(key, JSON.stringify(data));
    }

    get = async (key) => {
        return new Promise((resolve, reject) => {
          this.redis.get(key, (err, data) => {
            if (err) {
              reject(err);
            } else {
              resolve(JSON.parse(data));
            }
          });
        });
    }
}

export default new dbConn();