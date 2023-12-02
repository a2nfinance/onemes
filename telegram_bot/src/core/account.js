const phonePattern = new RegExp(/^\+[1-9]{1}[0-9]{0,2}[0-9]+$/);
const emailPattern = new RegExp(/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,10}$/);
const twitterPattern = new RegExp(/^@[a-zA-Z0-9_]{0,15}$/);
const telegramPattern = new RegExp(/^[0-9]+$/);
const onemesNamingPattern = new RegExp(/^[a-zA-Z0-9._-]+\.(onemes)$/);

const getFilterQuery = (value) => {
    if (phonePattern.test(value)) {
        return { phone_number: value }
    }

    if (emailPattern.test(value)) {
        return { email: value }
    }

    if (twitterPattern.test(value)) {
        return { twitter: value }
    }

    if (telegramPattern.test(value)) {
        return { telegram: value }
    }

    if (onemesNamingPattern.test(value)) {
        return { onemes_name: value }
    }
}
const searchAccounts = async (name) => {
    try {
        const query = getFilterQuery(name);
        let getReq = await fetch(`${process.env.API_URL}/api/account/search-account`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(query)
        })
        let res = await getReq.json();
        if (res.success && res.accounts.length) {
            const accounts = res.accounts;
            let message = `Wallet address is ${accounts[0].wallet_address}. \n`

            let chains = accounts.map(a => {
                return a.chain.toUpperCase();
            })

            chains = chains.join(" and ")

            message += `This account is available on ${chains} network(s)`;
            return message;

        } else {
            return `Could not found information of the account ${name}`;
        }
    } catch (e) {
        console.log(e);
        return `Could not found information of the account ${name}`;
    }


}

const saveTransferRequest = async (sender, message, messageId) => {
    try {
        console.log(sender, message, messageId)
        await fetch(`${process.env.API_URL}/api/telegram/save-request`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                sender: sender,
                message: message,
                message_id: messageId,
                type: 2
            })
        })
        return "Your transfer token request has been sent. Once the transaction is completed, you will receive a message!"
    } catch(e) {
        console.log(e)
        return "An error occured! please send a correct request again!"
    }
}

module.exports = {
    searchAccounts,
    saveTransferRequest
}