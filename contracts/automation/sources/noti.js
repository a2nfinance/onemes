const requestIds = args;
const url = "https://backend.onemes.a2n.finance/api/request/noti";
const req = Functions.makeHttpRequest({
  url: url,
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  data: JSON.stringify(requestIds)
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