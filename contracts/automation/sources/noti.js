const countryCode = args;
const url = "https://537b-1-55-14-115.ngrok.io/api/request/noti";
const req = Functions.makeHttpRequest({
  url: url,
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  data: JSON.stringify(args)
});

const res = await req;
if (res.error) {
    console.error(
        res.response
          ? `${res.response.status},${res.response.statusText}`
          : ""
      );
      throw Error("Request failed");
}

return Functions.encodeString(JSON.stringify(res["data"]));