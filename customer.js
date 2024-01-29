const mongoose = require("mongoose");
const {Schema} = mongoose;

main()
.then(()=>console.log("connection successful"))
.catch(err => console.log(err));

async function main() {
  await mongoose.connect("mongodb://127.0.0.1:27017/newRelationDemo");
}

const orderSchema = new Schema ({
    item: String,
    price: Number,
});

const customerSchema = new Schema ({
    name: String,
    orders: [
        {  type: Schema.Types.ObjectId,
            ref: "Order"
        },
    ],
});

/*customerSchema.pre("findOneDelete", async()=>{
    console.log("PRE MIDDLEWARE");
});
*/

customerSchema.post("findOneAndDelete", async(customer)=>{
   if(customer.orders.length) {
    let res = await Order.deleteMany({ _id: { $in: customer.orders }});
     console.log(res);
}
});


const Order = mongoose.model("Order", orderSchema);
const Customer = mongoose.model("Customer", customerSchema);

const findCustomer = async ()=>{
   let result = await Customer.find({}).populate("orders");
   console.log(result[0]);
};

const addCust = async ()=>{
    let newCust = new Customer ({
            name: "Karan Arjun",
    });
    let newOrder = new Order({
        item: "Burger",
        price:200,
    });

    newCust.orders.push(newOrder);
    await newOrder.save();
    await newCust.save();

 console.log("added new customer");
};


const delCust = async ()=>{
    let data = await  Customer.findByIdAndDelete("658735cd2c36f2a34cf3534d");
    console.log(data);
};

//addCust();
delCust();

