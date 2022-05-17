class JsonVerifier {
  constructor(json) {
    this.json = json;
    this.errors = [];
    this.mainVerifier();
  }

  mainVerifier = () => {
    this.headers();
  };
  headers = () => {
    const [Title, Date] = Object.keys(this.json[0]);
    console.log(Title);
    console.log(Date);
    if (!Title || !Date) {
      this.errors.push("expected headers are not included");
    } else console.log("headers are included");
  };
}

module.exports = JsonVerifier;
