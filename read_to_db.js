const fs = require('fs');
const Sequelize = require('sequelize');

const db = new Sequelize(process.env.DATABASE_URL || 'postgres://localhost/stocks');

const Transaction = db.define('transaction', {
  date: {
    type: Sequelize.DATEONLY,
    allowNull: false
  },
  transaction_type: {
    type: Sequelize.STRING,
    allowNull: false
  },
  security_type: {
    type: Sequelize.STRING,
    allowNull: false
  },
  symbol: {
    type: Sequelize.STRING,
    allowNull: false    
  },
  quantity: {
    type: Sequelize.FLOAT,
    allowNull: false
  },
  amount: {
    type: Sequelize.FLOAT,
    allowNull: false    
  },
  commission: {
    type: Sequelize.FLOAT,
    allowNull: false    
  },
  description: {
    type: Sequelize.STRING,
    allowNull: false    
  }
}, {timestamps: false});



const test_text = [];

const test_data = async() => {
  await db.sync({force: true});
  await fs.readFile('./test_data.csv', (err, data)=>{
    data = data.toString().split('\n');
    for (let i in data) {
      data[i] = data[i].split(',');
      if (data[i].length > 1) test_text.push(data[i]);
    }
    test_text.shift();
    test_text.shift();

    for (let i in test_text) {
      Transaction.create({
	date: test_text[i][0],
	transaction_type: test_text[i][1],
	security_type: test_text[i][2],
	symbol: test_text[i][3],
	quantity: Number(test_text[i][4]),
	amount: Number(test_text[i][5]),
	price: Number(test_text[i][6]),
	commission: Number(test_text[i][7]),
	description: test_text[i][8]
      });
    }
  });
};

test_data();

