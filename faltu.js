const postProduct = async (req, res) => {
    try {
      let {
        title,
        description,
        price,
        currencyId,
        currencyFormat,
        style,
        availableSizes,
        installments
      } = req.body;
  
      // Check if details are valid or not
      if (!isValid(title) || !isValid(description) || !isValid(currencyFormat) || !isValid(currencyId)) {
        return res.status(400).send({
          status: false,
          message: "Provide valid details"
        });
      }
  
      if (!price || typeof price !== "number") {
        return res.status(400).send({
          status: false,
          message: "Provide valid price"
        });
      }
  
      if (style && typeof style !== "string") {
        return res.status(400).send({
          status: false,
          message: "Provide valid style"
        });
      }
  
      if (installments && typeof installments !== "number") {
        return res.status(400).send({
          status: false,
          message: "Provide valid installments"
        });
      }
  
      if (!availableSizes || !Array.isArray(availableSizes) || availableSizes.length === 0) {
        return res.status(400).send({
          status: false,
          message: "Provide at least one valid available size"
        });
      }
  
      const productSize = ["S", "XS", "M", "X", "L", "XXL", "XL"];
      for (let i = 0; i < availableSizes.length; i++) {
        if (!productSize.includes(availableSizes[i])) {
          return res.status(400).send({
            status: false,
            message: "Provide valid size"
          });
        }
      }
  
      // AWS S3
  
      let files = req.files;
      if (files && files.length > 0) {
        let awss3link = await uploadFile(files[0]);
        req.body.productImage = awss3link;
      } else {
        return res.status(400).send({
          status: false,
          message: "Please provide a valid product image"
        });
      }
  
      // Checking uniqueness
  
      let titleAlreadyExists = await productModel.findOne({ title: title });
      if (titleAlreadyExists) {
        return res.status(400).send({
          status: false,
          message: "Title already exists"
        });
      }
  
      const postedProduct = await productModel.create(req.body);
  
      res.status(201).send({
        status: true,
        message: "Product is successfully posted",
        data: postedProduct
      });
    } catch (error) {
      res.status(500).send({
        status: false,
        message: error.message
      });
    }
  };
  