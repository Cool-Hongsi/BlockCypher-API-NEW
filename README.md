# BlockCypher-API
<div>Through BlockCypher API, Created web application which can retrieve the balance from a virtual wallet as well as set up payment system</div>
<h2>INSTALLATION</h2>
<ul>
    <li>Clone https://github.com/Cool-Hongsi/BlockCypher-API-NEW.git</li>
    <li>./BlockCypher-API -> npm install (To install necessary backend modules)</li>
    <li>./BlockCypher-API/view -> npm install (To install necessary frontend modules)</li>
    <li>./BlockCypher-API -> npm run dev (To execute the program)</li>
</ul>
<h2>SET UP</h2>
<ul>
    <li>Development Program : Visual Studio Code</li>
    <li>Model : MySQL</li>
    <li>View : ReactJS
        <ul>
            <li>axios</li>
            <li>bootstrap</li>
            <li>gsap</li>
            <li>react-router-dom</li>
        </ul>
    </li>
    <li>Controller : NodeJS
        <ul>
            <li>@types/bitcoinjs-lib</li>
            <li>bitcoin-transaction</li>
            <li>body-parser</li>
            <li>express</li>
            <li>mysql</li>
            <li>concurrently</li>
            <li>node-fetch</li>
        </ul>
    </li>
</ul>
<h2>PROCESS</h2>
    <ol>
        <li>Generate random virtual wallet (Receive public address & private key)</li>
        <li>Achieve testnet bitcoin in virtual wallet via (https://tbtc.bitaps.com)</li>
        <li>Once the virtual wallet is charged by testnet bitcoin, the transaction record in virtual wallet will be added. (Can see the data by using BlockCypher API).</li>
        <li>Now, the user is able to view the record of wallet (including balance)</li>
        <li>Type another virtual wallet public address that the user would like to transfer bitcoin and amount</li>
        <li>The user is able to find out hex code and put the hex code into https://live.blockcypher.com/btc-testnet/pushtx</li>
        <li>Once the transaction is completed, the additional transaction record in virtual wallet will be added.</li>
        <li>Once the user clicks 'Add Transaction', the record of transaction (Particularly, hash code) will be stored in MySQL</li>
        <li>Once the user clicks 'Show Transaction', the record of transaction (All records) will be indicated on page</li>
    </ol>
