import React, { useState } from "react";
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  Alert,
} from "react-native";

const COLORS = {
  red: "#B51F2B",
  darkRed: "#861522",
  gold: "#E6B84A",
  cream: "#FFF8EB",
  white: "#FFFFFF",
  dark: "#292321",
  gray: "#77716E",
  lightGray: "#F1EDE8",
  green: "#39845A",
};

const PRODUCTS = [
  {
    id: "1",
    name: "Spaghetti à Bolonhesa",
    category: "Massas",
    price: 32.9,
    emoji: "🍝",
    description: "Spaghetti com molho à bolonhesa preparado com temperos especiais.",
    ingredients: ["Massa", "Molho bolonhesa", "Queijo parmesão", "Manjericão"],
    popular: true,
  },
  {
    id: "2",
    name: "Fettuccine Alfredo",
    category: "Massas",
    price: 36.9,
    emoji: "🍜",
    description: "Massa fettuccine com molho cremoso e parmesão.",
    ingredients: ["Fettuccine", "Molho branco", "Queijo parmesão"],
    popular: true,
  },
  {
    id: "3",
    name: "Penne ao Sugo",
    category: "Massas",
    price: 27.9,
    emoji: "🍝",
    description: "Penne com molho de tomate, ervas e manjericão.",
    ingredients: ["Penne", "Molho de tomate", "Manjericão", "Queijo"],
    popular: false,
  },
  {
    id: "4",
    name: "Lasanha da Casa",
    category: "Massas",
    price: 39.9,
    emoji: "🧀",
    description: "Lasanha em camadas com molho especial e queijo gratinado.",
    ingredients: ["Massa", "Molho bolonhesa", "Queijo", "Molho branco"],
    popular: true,
  },
  {
    id: "5",
    name: "Ravioli de Queijo",
    category: "Massas",
    price: 34.9,
    emoji: "🥟",
    description: "Ravioli recheado com queijo e servido com molho de tomate.",
    ingredients: ["Ravioli", "Queijo", "Molho de tomate", "Manjericão"],
    popular: false,
  },
  {
    id: "6",
    name: "Macarrão ao Pesto",
    category: "Massas",
    price: 35.9,
    emoji: "🌿",
    description: "Massa com molho pesto de manjericão.",
    ingredients: ["Massa", "Pesto", "Queijo parmesão"],
    popular: false,
  },
  {
    id: "7",
    name: "Tiramisù",
    category: "Sobremesas",
    price: 16.9,
    emoji: "🍰",
    description: "Sobremesa inspirada na tradicional receita italiana.",
    ingredients: ["Creme", "Café", "Cacau"],
    popular: false,
  },
  {
    id: "8",
    name: "Refrigerante",
    category: "Bebidas",
    price: 7.9,
    emoji: "🥤",
    description: "Bebida gelada para acompanhar sua massa.",
    ingredients: ["Refrigerante"],
    popular: false,
  },
];

const money = (value) =>
  value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });

export default function App() {
  const [screen, setScreen] = useState("home");
  const [previousScreen, setPreviousScreen] = useState("home");

  const [user, setUser] = useState(null);
  const [nameInput, setNameInput] = useState("");
  const [emailInput, setEmailInput] = useState("");
  const [passwordInput, setPasswordInput] = useState("");

  const [products, setProducts] = useState(PRODUCTS);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("Todos");

  const [selectedProduct, setSelectedProduct] = useState(null);
  const [removedIngredients, setRemovedIngredients] = useState([]);
  const [quantity, setQuantity] = useState(1);
  const [notes, setNotes] = useState("");

  const [cart, setCart] = useState([]);
  const [deliveryType, setDeliveryType] = useState("Entrega");
  const [address, setAddress] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("Pix");
  const [coupon, setCoupon] = useState("");
  const [discount, setDiscount] = useState(0);

  const [orders, setOrders] = useState([]);
  const [points, setPoints] = useState(120);
  const [feedback, setFeedback] = useState("");
  const [rating, setRating] = useState(5);

  const [chatInput, setChatInput] = useState("");
  const [chatMessages, setChatMessages] = useState([
    {
      from: "bot",
      text: "Olá! Eu sou o Pastechat! Quer ajuda para escolher seu pedido?",
    },
  ]);

  const [clubActive, setClubActive] = useState(false);
  const [sharedCode, setSharedCode] = useState("");
  const [sharedPeople, setSharedPeople] = useState([]);
  const [sharedName, setSharedName] = useState("");
  const [sharedItems, setSharedItems] = useState([]);
  const [adminMode, setAdminMode] = useState(false);

  const [newProductName, setNewProductName] = useState("");
  const [newProductPrice, setNewProductPrice] = useState("");

  const subtotal = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const deliveryFee = deliveryType === "Entrega" && cart.length > 0 ? 5.9 : 0;
  const total = Math.max(0, subtotal + deliveryFee - discount);

  const navigate = (destination) => {
    setPreviousScreen(screen);
    setScreen(destination);
  };

  const goBack = () => {
    if (screen === "product" && selectedProduct) {
      setScreen(previousScreen === "product" ? "home" : previousScreen);
      return;
    }

    setScreen("home");
  };

  const showNotice = (message) => {
    Alert.alert("GANA Pasta", message);
  };

  const login = () => {
    if (!emailInput.trim() || !passwordInput.trim()) {
      showNotice("Preencha seu e-mail e sua senha.");
      return;
    }

    const displayName =
      nameInput.trim() || emailInput.split("@")[0] || "Cliente";

    setUser({ name: displayName, email: emailInput });

    setNameInput("");
    setEmailInput("");
    setPasswordInput("");

    setAdminMode(false);
    setScreen("home");
  };

  const logout = () => {
    setUser(null);
    setAdminMode(false);
    setScreen("home");
  };

  const openProduct = (product) => {
    setPreviousScreen(screen);
    setSelectedProduct(product);
    setRemovedIngredients([]);
    setQuantity(1);
    setNotes("");
    setScreen("product");
  };

  const addToCart = () => {
    if (!selectedProduct) return;

    const item = {
      ...selectedProduct,
      cartId: `${selectedProduct.id}-${Date.now()}`,
      quantity,
      removedIngredients: [...removedIngredients],
      notes,
    };

    setCart((oldCart) => [...oldCart, item]);
    setSelectedProduct(null);
    setQuantity(1);
    setScreen("cart");

    showNotice("Produto adicionado ao carrinho!");
  };

  const changeCartQuantity = (cartId, amount) => {
    setCart((oldCart) =>
      oldCart
        .map((item) =>
          item.cartId === cartId
            ? { ...item, quantity: item.quantity + amount }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const removeCartItem = (cartId) => {
    setCart((oldCart) => oldCart.filter((item) => item.cartId !== cartId));
  };

  const applyCoupon = () => {
    if (coupon.trim().toUpperCase() === "GANA10") {
      setDiscount(subtotal * 0.1);
      showNotice("Cupom GANA10 aplicado! Você ganhou 10% de desconto.");
    } else {
      setDiscount(0);
      showNotice("Cupom inválido. Tente o código GANA10.");
    }
  };

  const finishOrder = () => {
    if (cart.length === 0) {
      showNotice("Seu carrinho está vazio.");
      return;
    }

    if (deliveryType === "Entrega" && !address.trim()) {
      showNotice("Informe o endereço de entrega.");
      return;
    }

    const newOrder = {
      id: String(Date.now()).slice(-7),
      items: [...cart],
      total,
      deliveryType,
      address: deliveryType === "Entrega" ? address : "Retirada no restaurante",
      paymentMethod,
      status: "Recebido",
      date: new Date().toLocaleString("pt-BR"),
      feedback: "",
    };

    setOrders((oldOrders) => [newOrder, ...oldOrders]);
    setPoints((oldPoints) => oldPoints + Math.floor(total));
    setCart([]);
    setCoupon("");
    setDiscount(0);
    setScreen("orders");

    showNotice("Pedido realizado com sucesso! Obrigado por escolher a GANA Pasta.");
  };

  const sendChatMessage = () => {
    const message = chatInput.trim();
    if (!message) return;

    const lower = message.toLowerCase();

    let reply =
      "Que tal experimentar nosso Spaghetti à Bolonhesa? É um dos favoritos da casa! 🍝";

    if (lower.includes("vegetar") || lower.includes("sem carne")) {
      reply =
        "Você pode experimentar o Penne ao Sugo ou o Macarrão ao Pesto. Confira os ingredientes antes de pedir! 🌿";
    } else if (lower.includes("doce") || lower.includes("sobremesa")) {
      reply =
        "Temos Tiramisù para deixar sua refeição ainda mais especial! 🍰";
    } else if (lower.includes("barato") || lower.includes("preço")) {
      reply =
        "O Penne ao Sugo é uma das opções mais econômicas do nosso cardápio. 😊";
    } else if (lower.includes("pedido")) {
      reply =
        orders.length > 0
          ? `Seu pedido mais recente é o #${orders[0].id} e está com status: ${orders[0].status}.`
          : "Você ainda não tem pedidos. Que tal escolher uma massa deliciosa?";
    } else if (lower.includes("oi") || lower.includes("olá")) {
      reply = "Olá! Que bom ter você aqui! Como posso ajudar?";
    }

    setChatMessages((oldMessages) => [
      ...oldMessages,
      { from: "user", text: message },
      { from: "bot", text: reply },
    ]);

    setChatInput("");
  };

  const createSharedOrder = () => {
    const code = Math.random().toString(36).substring(2, 8).toUpperCase();
    setSharedCode(code);
    setSharedPeople([user?.name || "Organizador"]);
    setSharedItems([]);
    setScreen("shared");
    showNotice(`Seu pedido compartilhado foi criado! Código: ${code}`);
  };

  const joinSharedOrder = () => {
    if (!sharedCode.trim()) {
      showNotice("Digite o código do pedido compartilhado.");
      return;
    }

    setSharedPeople((oldPeople) => {
      const person = user?.name || "Convidado";
      return oldPeople.includes(person) ? oldPeople : [...oldPeople, person];
    });

    showNotice("Você entrou no pedido compartilhado!");
  };

  const addSharedItem = (product) => {
    const person = user?.name || "Convidado";

    setSharedItems((oldItems) => [
      ...oldItems,
      {
        ...product,
        sharedId: `${Date.now()}-${Math.random()}`,
        person,
      },
    ]);

    showNotice(`${product.name} adicionado ao pedido compartilhado.`);
  };

  const finishSharedOrder = () => {
    if (sharedItems.length === 0) {
      showNotice("Adicione produtos antes de finalizar o pedido compartilhado.");
      return;
    }

    const sharedTotal = sharedItems.reduce((sum, item) => sum + item.price, 0);

    setCart((oldCart) => [
      ...oldCart,
      ...sharedItems.map((item) => ({
        ...item,
        cartId: item.sharedId,
        quantity: 1,
        notes: `Pedido compartilhado - ${item.person}`,
        removedIngredients: [],
      })),
    ]);

    setSharedItems([]);
    setSharedCode("");
    setSharedPeople([]);
    setScreen("cart");

    showNotice(
      `Os itens foram enviados ao carrinho. Total dos itens compartilhados: ${money(sharedTotal)}. Revise e finalize o pagamento.`
    );
  };

  const addAdminProduct = () => {
    const price = Number(newProductPrice.replace(",", "."));

    if (!newProductName.trim() || !Number.isFinite(price) || price <= 0) {
      showNotice("Informe um nome e um preço válido.");
      return;
    }

    const newProduct = {
      id: String(Date.now()),
      name: newProductName.trim(),
      category: "Massas",
      price,
      emoji: "🍝",
      description: "Uma novidade deliciosa da GANA Pasta.",
      ingredients: ["Massa", "Molho da casa"],
      popular: false,
    };

    setProducts((oldProducts) => [...oldProducts, newProduct]);
    setNewProductName("");
    setNewProductPrice("");
    showNotice("Produto adicionado ao cardápio!");
  };

  const updateOrderStatus = (orderId, status) => {
    setOrders((oldOrders) =>
      oldOrders.map((order) =>
        order.id === orderId ? { ...order, status } : order
      )
    );
  };

  const deleteProduct = (productId) => {
    Alert.alert("Remover produto", "Deseja remover este produto do cardápio?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Remover",
        style: "destructive",
        onPress: () => {
          setProducts((oldProducts) =>
            oldProducts.filter((product) => product.id !== productId)
          );
        },
      },
    ]);
  };

  const Button = ({
    title,
    onPress,
    variant = "primary",
    style,
    textStyle,
  }) => (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={onPress}
      style={[
        styles.button,
        variant === "secondary" && styles.buttonSecondary,
        variant === "outline" && styles.buttonOutline,
        variant === "gold" && styles.buttonGold,
        variant === "danger" && styles.buttonDanger,
        style,
      ]}
    >
      <Text
        style={[
          styles.buttonText,
          variant === "secondary" && styles.buttonSecondaryText,
          variant === "outline" && styles.buttonOutlineText,
          variant === "gold" && styles.buttonGoldText,
          textStyle,
        ]}
      >
        {title}
      </Text>
    </TouchableOpacity>
  );

  const Header = ({ title, subtitle }) => (
    <View style={styles.pageHeader}>
      <TouchableOpacity onPress={goBack} style={styles.backButton}>
        <Text style={styles.backButtonText}>‹</Text>
      </TouchableOpacity>

      <View style={{ flex: 1 }}>
        <Text style={styles.pageTitle}>{title}</Text>
        {subtitle ? <Text style={styles.pageSubtitle}>{subtitle}</Text> : null}
      </View>

      <TouchableOpacity onPress={() => setScreen("cart")} style={styles.cartIcon}>
        <Text style={styles.cartIconText}>🛒</Text>
        {cart.length > 0 && (
          <View style={styles.cartBadge}>
            <Text style={styles.cartBadgeText}>{cart.length}</Text>
          </View>
        )}
      </TouchableOpacity>
    </View>
  );

  const ProductCard = ({ product }) => (
    <TouchableOpacity
      style={styles.productCard}
      activeOpacity={0.85}
      onPress={() => openProduct(product)}
    >
      <View style={styles.productEmoji}>
        <Text style={{ fontSize: 43 }}>{product.emoji}</Text>
      </View>

      <View style={styles.productInfo}>
        <Text style={styles.productName}>{product.name}</Text>
        <Text style={styles.productDescription} numberOfLines={2}>
          {product.description}
        </Text>
        <Text style={styles.productPrice}>{money(product.price)}</Text>
      </View>

      <View style={styles.addCircle}>
        <Text style={styles.addCircleText}>+</Text>
      </View>
    </TouchableOpacity>
  );

  const renderHome = () => {
    const filteredProducts = products.filter((product) => {
      const matchesSearch =
        product.name.toLowerCase().includes(search.toLowerCase()) ||
        product.description.toLowerCase().includes(search.toLowerCase());

      const matchesCategory =
        category === "Todos" || product.category === category;

      return matchesSearch && matchesCategory;
    });

    return (
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.hero}>
          <View style={styles.topBar}>
            <View>
              <Text style={styles.brandName}>GANA PASTA</Text>
            </View>

            <TouchableOpacity
              style={styles.avatar}
              onPress={() => navigate("profile")}
            >
              <Text style={{ fontSize: 24 }}>👤</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.heroContent}>
            <View style={{ flex: 1 }}>
              <Text style={styles.heroSubtitle}>
                Massa feita com carinho,{"\n"}sabor que conquista.
              </Text>

              <Button
                title="VER CARDÁPIO"
                variant="gold"
                onPress={() => {
                  setCategory("Todos");
                  setSearch("");
                  navigate("menu");
                }}
                style={{ alignSelf: "flex-start", marginTop: 16 }}
              />
            </View>

            <View style={styles.mascotCircle}>
              <Text style={{ fontSize: 73 }}>🐔</Text>
            </View>
          </View>
        </View>

        <View style={styles.content}>
          <View style={styles.welcomeRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.greeting}>
                Olá{user ? `, ${user.name}` : ""}!
              </Text>
              <Text style={styles.mutedText}>
                O que vamos saborear hoje?
              </Text>
            </View>

            <View style={styles.pointsPill}>
              <Text style={styles.pointsText}>⭐ {points} pts</Text>
            </View>
          </View>

          <TouchableOpacity
            style={styles.searchBox}
            onPress={() => navigate("menu")}
            activeOpacity={0.9}
          >
            <Text style={styles.searchIcon}>🔍</Text>
            <Text style={styles.searchPlaceholder}>
              Buscar massas, sabores...
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.promoCard}
            onPress={() => {
              setCategory("Massas");
              navigate("menu");
            }}
          >
            <View style={{ flex: 1 }}>
              <Text style={styles.promoEyebrow}>PROMOÇÃO ESPECIAL</Text>
              <Text style={styles.promoTitle}>Sua massa favorita</Text>
              <Text style={styles.promoSubtitle}>
                Peça hoje e aproveite!
              </Text>
            </View>
            <Text style={{ fontSize: 55 }}>🍝</Text>
          </TouchableOpacity>

          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Categorias</Text>
            <TouchableOpacity onPress={() => navigate("menu")}>
              <Text style={styles.seeAll}>Ver todas →</Text>
            </TouchableOpacity>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 8 }}
          >
            {[
              { name: "Todos", emoji: "🍽️" },
              { name: "Massas", emoji: "🍝" },
              { name: "Bebidas", emoji: "🥤" },
              { name: "Sobremesas", emoji: "🍰" },
            ].map((item) => (
              <TouchableOpacity
                key={item.name}
                onPress={() => {
                  setCategory(item.name);
                  navigate("menu");
                }}
                style={styles.categoryCard}
              >
                <Text style={{ fontSize: 27 }}>{item.emoji}</Text>
                <Text style={styles.categoryText}>{item.name}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Mais pedidos</Text>
            <TouchableOpacity onPress={() => navigate("menu")}>
              <Text style={styles.seeAll}>Ver cardápio →</Text>
            </TouchableOpacity>
          </View>

          {products
            .filter((product) => product.popular)
            .map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}

          <View style={styles.featureCard}>
            <Text style={{ fontSize: 31 }}>🤖</Text>
            <View style={{ flex: 1 }}>
              <Text style={styles.featureTitle}>Conheça o Pastechat!</Text>
              <Text style={styles.featureText}>
                Seu assistente para descobrir novos sabores.
              </Text>
            </View>
            <Button
              title="Conversar"
              onPress={() => navigate("chat")}
              style={{ paddingHorizontal: 12 }}
            />
          </View>

          <View style={styles.featureCard}>
            <Text style={{ fontSize: 31 }}>👨‍👩‍👧‍👦</Text>
            <View style={{ flex: 1 }}>
              <Text style={styles.featureTitle}>Massa em boa companhia</Text>
              <Text style={styles.featureText}>
                Monte um pedido com seus amigos.
              </Text>
            </View>
            <Button
              title="Criar"
              onPress={createSharedOrder}
              style={{ paddingHorizontal: 12 }}
            />
          </View>

          <View style={{ height: 22 }} />
        </View>
      </ScrollView>
    );
  };

  const renderMenu = () => {
    const filteredProducts = products.filter((product) => {
      const matchesSearch =
        product.name.toLowerCase().includes(search.toLowerCase()) ||
        product.description.toLowerCase().includes(search.toLowerCase());

      return (
        matchesSearch &&
        (category === "Todos" || product.category === category)
      );
    });

    return (
      <View style={{ flex: 1 }}>
        <Header title="Nosso cardápio" subtitle="Feito com amor" />

        <View style={styles.content}>
          <TextInput
            style={styles.input}
            placeholder="Buscar produtos..."
            placeholderTextColor={COLORS.gray}
            value={search}
            onChangeText={setSearch}
          />

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={{ maxHeight: 55, marginBottom: 10 }}
          >
            {["Todos", "Massas", "Bebidas", "Sobremesas"].map((item) => (
              <TouchableOpacity
                key={item}
                onPress={() => setCategory(item)}
                style={[
                  styles.filterChip,
                  category === item && styles.filterChipActive,
                ]}
              >
                <Text
                  style={[
                    styles.filterChipText,
                    category === item && styles.filterChipTextActive,
                  ]}
                >
                  {item}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          <ScrollView showsVerticalScrollIndicator={false}>
            {filteredProducts.length > 0 ? (
              filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))
            ) : (
              <Text style={styles.emptyText}>
                Nenhum produto encontrado.
              </Text>
            )}
            <View style={{ height: 25 }} />
          </ScrollView>
        </View>
      </View>
    );
  };

  const renderProduct = () => {
    if (!selectedProduct) return null;

    return (
      <ScrollView>
        <Header title="Detalhes do prato" />

        <View style={styles.content}>
          <View style={styles.productHero}>
            <Text style={{ fontSize: 100 }}>{selectedProduct.emoji}</Text>
          </View>

          <Text style={styles.detailTitle}>{selectedProduct.name}</Text>
          <Text style={styles.detailPrice}>
            {money(selectedProduct.price)}
          </Text>
          <Text style={styles.detailDescription}>
            {selectedProduct.description}
          </Text>

          <Text style={styles.sectionTitle}>Ingredientes</Text>
          <Text style={styles.mutedText}>
            Desmarque os ingredientes que deseja retirar.
          </Text>

          {selectedProduct.ingredients.map((ingredient) => {
            const removed = removedIngredients.includes(ingredient);

            return (
              <TouchableOpacity
                key={ingredient}
                onPress={() =>
                  setRemovedIngredients((oldIngredients) =>
                    removed
                      ? oldIngredients.filter((item) => item !== ingredient)
                      : [...oldIngredients, ingredient]
                  )
                }
                style={styles.ingredientRow}
              >
                <Text style={styles.ingredientName}>{ingredient}</Text>
                <View
                  style={[
                    styles.checkbox,
                    !removed && styles.checkboxActive,
                  ]}
                >
                  <Text style={styles.checkboxText}>
                    {removed ? "" : "✓"}
                  </Text>
                </View>
              </TouchableOpacity>
            );
          })}

          <Text style={[styles.sectionTitle, { marginTop: 20 }]}>
            Observações
          </Text>

          <TextInput
            style={[styles.input, { height: 85, textAlignVertical: "top" }]}
            placeholder="Ex.: pouco molho, sem queijo..."
            placeholderTextColor={COLORS.gray}
            value={notes}
            onChangeText={setNotes}
            multiline
          />

          <Text style={[styles.sectionTitle, { marginTop: 20 }]}>
            Quantidade
          </Text>

          <View style={styles.quantityRow}>
            <TouchableOpacity
              style={styles.quantityButton}
              onPress={() => setQuantity(Math.max(1, quantity - 1))}
            >
              <Text style={styles.quantityButtonText}>−</Text>
            </TouchableOpacity>

            <Text style={styles.quantityNumber}>{quantity}</Text>

            <TouchableOpacity
              style={styles.quantityButton}
              onPress={() => setQuantity(quantity + 1)}
            >
              <Text style={styles.quantityButtonText}>+</Text>
            </TouchableOpacity>
          </View>

          <Button
            title={`Adicionar • ${money(selectedProduct.price * quantity)}`}
            onPress={addToCart}
            style={{ marginTop: 25 }}
          />

          <View style={{ height: 30 }} />
        </View>
      </ScrollView>
    );
  };

  const renderCart = () => (
    <ScrollView>
      <Header title="Meu carrinho" subtitle="Revise seu pedido" />

      <View style={styles.content}>
        {cart.length === 0 ? (
          <View style={styles.emptyCard}>
            <Text style={{ fontSize: 60 }}>🛒</Text>
            <Text style={styles.emptyTitle}>Seu carrinho está vazio</Text>
            <Text style={styles.mutedText}>
              Que tal escolher uma massa deliciosa?
            </Text>
            <Button
              title="Explorar cardápio"
              onPress={() => navigate("menu")}
              style={{ marginTop: 18 }}
            />
          </View>
        ) : (
          <>
            {cart.map((item) => (
              <View key={item.cartId} style={styles.cartItem}>
                <Text style={{ fontSize: 35 }}>{item.emoji}</Text>

                <View style={{ flex: 1, marginHorizontal: 10 }}>
                  <Text style={styles.productName}>{item.name}</Text>
                  <Text style={styles.productPrice}>
                    {money(item.price * item.quantity)}
                  </Text>

                  {item.removedIngredients?.length > 0 && (
                    <Text style={styles.mutedText}>
                      Sem: {item.removedIngredients.join(", ")}
                    </Text>
                  )}

                  {item.notes ? (
                    <Text style={styles.mutedText}>{item.notes}</Text>
                  ) : null}

                  <View style={styles.smallQuantityRow}>
                    <TouchableOpacity
                      onPress={() => changeCartQuantity(item.cartId, -1)}
                      style={styles.smallQuantityButton}
                    >
                      <Text>−</Text>
                    </TouchableOpacity>

                    <Text style={styles.quantityNumber}>{item.quantity}</Text>

                    <TouchableOpacity
                      onPress={() => changeCartQuantity(item.cartId, 1)}
                      style={styles.smallQuantityButton}
                    >
                      <Text>+</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      onPress={() => removeCartItem(item.cartId)}
                      style={{ marginLeft: 12 }}
                    >
                      <Text style={{ color: COLORS.red, fontSize: 12 }}>
                        Remover
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            ))}

            <Button
              title="+ Adicionar mais produtos"
              variant="outline"
              onPress={() => navigate("menu")}
              style={{ marginTop: 12 }}
            />

            <Text style={[styles.sectionTitle, { marginTop: 25 }]}>
              Tipo de pedido
            </Text>

            <View style={styles.choiceRow}>
              {["Entrega", "Retirada"].map((item) => (
                <TouchableOpacity
                  key={item}
                  onPress={() => setDeliveryType(item)}
                  style={[
                    styles.choiceCard,
                    deliveryType === item && styles.choiceCardActive,
                  ]}
                >
                  <Text style={{ fontSize: 23 }}>
                    {item === "Entrega" ? "🛵" : "🏪"}
                  </Text>
                  <Text
                    style={[
                      styles.choiceText,
                      deliveryType === item && styles.choiceTextActive,
                    ]}
                  >
                    {item}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {deliveryType === "Entrega" && (
              <>
                <Text style={styles.label}>Endereço de entrega</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Rua, número, bairro e complemento"
                  placeholderTextColor={COLORS.gray}
                  value={address}
                  onChangeText={setAddress}
                />
              </>
            )}

            <Text style={[styles.sectionTitle, { marginTop: 20 }]}>
              Cupom de desconto
            </Text>

            <View style={styles.couponRow}>
              <TextInput
                style={[styles.input, { flex: 1, marginBottom: 0 }]}
                placeholder="Digite GANA10"
                placeholderTextColor={COLORS.gray}
                value={coupon}
                onChangeText={setCoupon}
                autoCapitalize="characters"
              />

              <Button
                title="Aplicar"
                onPress={applyCoupon}
                style={{ marginLeft: 8 }}
              />
            </View>

            <Text style={[styles.sectionTitle, { marginTop: 24 }]}>
              Forma de pagamento
            </Text>

            {["Pix", "Cartão de crédito", "Cartão de débito", "Dinheiro"].map(
              (item) => (
                <TouchableOpacity
                  key={item}
                  onPress={() => setPaymentMethod(item)}
                  style={styles.paymentRow}
                >
                  <Text style={styles.paymentName}>{item}</Text>
                  <View
                    style={[
                      styles.radio,
                      paymentMethod === item && styles.radioActive,
                    ]}
                  >
                    {paymentMethod === item && <View style={styles.radioDot} />}
                  </View>
                </TouchableOpacity>
              )
            )}

            <View style={styles.summaryCard}>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Subtotal</Text>
                <Text style={styles.summaryValue}>{money(subtotal)}</Text>
              </View>

              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Entrega</Text>
                <Text style={styles.summaryValue}>
                  {money(deliveryFee)}
                </Text>
              </View>

              {discount > 0 && (
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>Desconto</Text>
                  <Text style={{ color: COLORS.green }}>
                    - {money(discount)}
                  </Text>
                </View>
              )}

              <View style={styles.divider} />

              <View style={styles.summaryRow}>
                <Text style={styles.totalLabel}>Total</Text>
                <Text style={styles.totalValue}>{money(total)}</Text>
              </View>
            </View>

            <Button
              title="Finalizar pedido"
              onPress={finishOrder}
              style={{ marginTop: 15 }}
            />
          </>
        )}

        <View style={{ height: 30 }} />
      </View>
    </ScrollView>
  );

  const renderOrders = () => (
    <ScrollView>
      <Header title="Meus pedidos" subtitle="Acompanhe seus momentos deliciosos" />

      <View style={styles.content}>
        {orders.length === 0 ? (
          <View style={styles.emptyCard}>
            <Text style={{ fontSize: 55 }}>🍝</Text>
            <Text style={styles.emptyTitle}>Nenhum pedido ainda</Text>
            <Text style={styles.mutedText}>
              Seus pedidos aparecerão aqui.
            </Text>
            <Button
              title="Fazer primeiro pedido"
              onPress={() => navigate("menu")}
              style={{ marginTop: 18 }}
            />
          </View>
        ) : (
          orders.map((order) => (
            <View key={order.id} style={styles.orderCard}>
              <View style={styles.orderHeader}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.productName}>Pedido #{order.id}</Text>
                  <Text style={styles.mutedText}>{order.date}</Text>
                </View>
                <View style={styles.statusPill}>
                  <Text style={styles.statusText}>{order.status}</Text>
                </View>
              </View>

              {order.items.map((item, index) => (
                <Text key={`${item.cartId}-${index}`} style={styles.orderItemText}>
                  {item.quantity}× {item.name}
                </Text>
              ))}

              <View style={styles.divider} />

              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>{order.deliveryType}</Text>
                <Text style={styles.productPrice}>{money(order.total)}</Text>
              </View>

              <Text style={styles.mutedText}>
                Pagamento: {order.paymentMethod}
              </Text>

              <View style={styles.trackingBox}>
                <Text style={styles.trackingTitle}>Acompanhe seu pedido</Text>
                <Text style={styles.trackingText}>
                  {order.status === "Recebido"
                    ? "✓ Pedido recebido pela GANA Pasta"
                    : order.status === "Em preparo"
                    ? "✓ Pedido recebido\n✓ Sua massa está sendo preparada"
                    : order.status === "Saiu para entrega"
                    ? "✓ Pedido recebido\n✓ Preparado\n🛵 Saiu para entrega"
                    : "✓ Pedido concluído. Buon appetito!"}
                </Text>
              </View>

              <Button
                title="Avaliar pedido"
                variant="outline"
                onPress={() => {
                  setFeedback("");
                  setScreen("feedback");
                }}
                style={{ marginTop: 12 }}
              />

              {adminMode && (
                <View style={{ marginTop: 15 }}>
                  <Text style={styles.label}>Atualizar status (admin)</Text>
                  {[
                    "Recebido",
                    "Em preparo",
                    "Saiu para entrega",
                    "Concluído",
                  ].map((status) => (
                    <TouchableOpacity
                      key={status}
                      onPress={() => updateOrderStatus(order.id, status)}
                      style={styles.adminStatusButton}
                    >
                      <Text style={styles.adminStatusText}>{status}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>
          ))
        )}

        <View style={{ height: 25 }} />
      </View>
    </ScrollView>
  );

  const renderChat = () => (
    <View style={{ flex: 1 }}>
      <Header title="Pastechat 🤖" subtitle="Seu amigo das massas" />

      <View style={styles.chatWelcome}>
        <Text style={{ fontSize: 35 }}>🐔</Text>
        <View style={{ flex: 1 }}>
          <Text style={styles.featureTitle}>Olá! Sou o Pastechat.</Text>
          <Text style={styles.mutedText}>
            Posso ajudar você a descobrir novos sabores.
          </Text>
        </View>
      </View>

      <ScrollView
        style={styles.chatMessages}
        contentContainerStyle={{ paddingBottom: 15 }}
      >
        {chatMessages.map((message, index) => (
          <View
            key={index}
            style={[
              styles.chatBubble,
              message.from === "user"
                ? styles.chatBubbleUser
                : styles.chatBubbleBot,
            ]}
          >
            <Text
              style={[
                styles.chatText,
                message.from === "user" && styles.chatTextUser,
              ]}
            >
              {message.text}
            </Text>
          </View>
        ))}

        <Text style={styles.chatSuggestionsTitle}>Sugestões para começar</Text>

        {[
          "Qual massa você recomenda?",
          "Quais são as opções sem carne?",
          "Quero uma sobremesa!",
          "Como está meu pedido?",
        ].map((suggestion) => (
          <TouchableOpacity
            key={suggestion}
            onPress={() => {
              setChatInput(suggestion);
            }}
            style={styles.suggestionChip}
          >
            <Text style={styles.suggestionText}>{suggestion}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <View style={styles.chatInputRow}>
        <TextInput
          style={[styles.input, styles.chatInput]}
          placeholder="Escreva sua mensagem..."
          placeholderTextColor={COLORS.gray}
          value={chatInput}
          onChangeText={setChatInput}
          onSubmitEditing={sendChatMessage}
          returnKeyType="send"
        />

        <TouchableOpacity
          style={styles.chatSendButton}
          onPress={sendChatMessage}
        >
          <Text style={styles.chatSendText}>➤</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderProfile = () => (
    <ScrollView>
      <Header title="Minha conta" />

      <View style={styles.content}>
        <View style={styles.profileCard}>
          <View style={styles.profileAvatar}>
            <Text style={{ fontSize: 48 }}>👤</Text>
          </View>

          <Text style={styles.profileName}>
            {user ? user.name : "Bem-vindo à GANA Pasta"}
          </Text>

          <Text style={styles.mutedText}>
            {user ? user.email : "Entre ou crie sua conta"}
          </Text>

          {!user ? (
            <>
              <TextInput
                style={styles.input}
                placeholder="Seu nome (opcional)"
                placeholderTextColor={COLORS.gray}
                value={nameInput}
                onChangeText={setNameInput}
              />

              <TextInput
                style={styles.input}
                placeholder="E-mail"
                placeholderTextColor={COLORS.gray}
                value={emailInput}
                onChangeText={setEmailInput}
                keyboardType="email-address"
                autoCapitalize="none"
              />

              <TextInput
                style={styles.input}
                placeholder="Senha"
                placeholderTextColor={COLORS.gray}
                value={passwordInput}
                onChangeText={setPasswordInput}
                secureTextEntry
              />

              <Button
                title="Entrar / Criar conta"
                onPress={login}
                style={{ marginTop: 5 }}
              />

            </>
          ) : (
            <Button
              title="Sair da conta"
              variant="outline"
              onPress={logout}
              style={{ marginTop: 15 }}
            />
          )}
        </View>

        <View style={styles.pointsCard}>
          <Text style={{ fontSize: 30 }}>⭐</Text>
          <View style={{ flex: 1 }}>
            <Text style={styles.pointsCardTitle}>Programa GANA de pontos</Text>
            <Text style={styles.pointsCardSubtitle}>
              Você tem {points} pontos.
            </Text>
          </View>
        </View>

        <TouchableOpacity
          style={styles.menuLink}
          onPress={() => navigate("orders")}
        >
          <Text style={styles.menuLinkIcon}>📦</Text>
          <Text style={styles.menuLinkText}>Meus pedidos</Text>
          <Text style={styles.menuLinkArrow}>›</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.menuLink}
          onPress={() => navigate("club")}
        >
          <Text style={styles.menuLinkIcon}>👑</Text>
          <Text style={styles.menuLinkText}>Clube Massa do Mês</Text>
          <Text style={styles.menuLinkArrow}>›</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.menuLink}
          onPress={() => navigate("shared")}
        >
          <Text style={styles.menuLinkIcon}>👨‍👩‍👧‍👦</Text>
          <Text style={styles.menuLinkText}>Pedido compartilhado</Text>
          <Text style={styles.menuLinkArrow}>›</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.menuLink}
          onPress={() => navigate("feedback")}
        >
          <Text style={styles.menuLinkIcon}>⭐</Text>
          <Text style={styles.menuLinkText}>Enviar avaliação</Text>
          <Text style={styles.menuLinkArrow}>›</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.menuLink}
          onPress={() => {
            setAdminMode(!adminMode);
            navigate("admin");
          }}
        >
          <Text style={styles.menuLinkIcon}>⚙️</Text>
          <Text style={styles.menuLinkText}>Área administrativa</Text>
          <Text style={styles.menuLinkArrow}>›</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );

  const renderClub = () => (
    <ScrollView>
      <Header title="Clube Massa do Mês" />

      <View style={styles.content}>
        <View style={styles.clubHero}>
          <Text style={{ fontSize: 65 }}>👑</Text>
          <Text style={styles.clubTitle}>CLUBE MASSA DO MÊS</Text>
          <Text style={styles.clubSubtitle}>
            Uma experiência italiana, todos os meses.
          </Text>
        </View>

        <Text style={styles.sectionTitle}>Escolha seu plano</Text>

        <View style={styles.planCard}>
          <Text style={styles.planName}>Plano Classico</Text>
          <Text style={styles.planPrice}>R$ 39,90/mês</Text>
          <Text style={styles.planDescription}>
            • Uma experiência especial por mês{"\n"}
            • Promoções exclusivas{"\n"}
            • Pontos extras em campanhas{"\n"}
            • Novidades do cardápio
          </Text>

          <Button
            title={clubActive ? "Plano ativado ✓" : "Escolher plano"}
            onPress={() => {
              setClubActive(!clubActive);
              showNotice(
                clubActive
                  ? "Plano desativado na demonstração."
                  : "Plano ativado na demonstração! Nenhuma cobrança será realizada."
              );
            }}
            variant={clubActive ? "secondary" : "gold"}
          />
        </View>
      </View>
    </ScrollView>
  );

  const renderShared = () => (
    <ScrollView>
      <Header title="Pedido compartilhado" subtitle="A melhor massa é aquela dividida!" />

      <View style={styles.content}>
        <View style={styles.sharedBanner}>
          <Text style={{ fontSize: 55 }}>👨‍👩‍👧‍👦</Text>
          <Text style={styles.sharedBannerTitle}>
            Monte um pedido com todo mundo
          </Text>
          <Text style={styles.sharedBannerText}>
            Cada pessoa escolhe seus pratos e vocês revisam tudo juntos.
          </Text>
        </View>

        <Button
          title="＋ Criar pedido compartilhado"
          onPress={createSharedOrder}
        />

        <Text style={[styles.sectionTitle, { marginTop: 25 }]}>
          Entrar com código
        </Text>

        <TextInput
          style={styles.input}
          placeholder="Digite o código do convite"
          placeholderTextColor={COLORS.gray}
          value={sharedCode}
          onChangeText={setSharedCode}
          autoCapitalize="characters"
        />

        <Button
          title="Entrar no pedido"
          variant="outline"
          onPress={joinSharedOrder}
        />

        {sharedCode ? (
          <View style={styles.sharedCodeCard}>
            <Text style={styles.mutedText}>Código do pedido</Text>
            <Text style={styles.sharedCode}>{sharedCode}</Text>

            <Text style={styles.sectionTitle}>Participantes</Text>
            {sharedPeople.map((person, index) => (
              <Text key={`${person}-${index}`} style={styles.orderItemText}>
                👤 {person}
              </Text>
            ))}

            <Text style={[styles.sectionTitle, { marginTop: 15 }]}>
              Adicione itens
            </Text>

            {products.map((product) => (
              <View key={product.id} style={styles.sharedProductRow}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.productName}>{product.name}</Text>
                  <Text style={styles.productPrice}>
                    {money(product.price)}
                  </Text>
                </View>

                <Button
                  title="+"
                  onPress={() => addSharedItem(product)}
                  style={{ paddingHorizontal: 14 }}
                />
              </View>
            ))}

            <Text style={[styles.sectionTitle, { marginTop: 20 }]}>
              Itens escolhidos
            </Text>

            {sharedItems.length === 0 ? (
              <Text style={styles.mutedText}>
                Nenhum item adicionado ainda.
              </Text>
            ) : (
              sharedItems.map((item) => (
                <View key={item.sharedId} style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>
                    {item.name} · {item.person}
                  </Text>
                  <Text style={styles.summaryValue}>{money(item.price)}</Text>
                </View>
              ))
            )}

            <View style={styles.divider} />

            <View style={styles.summaryRow}>
              <Text style={styles.totalLabel}>Total dos itens</Text>
              <Text style={styles.totalValue}>
                {money(
                  sharedItems.reduce((sum, item) => sum + item.price, 0)
                )}
              </Text>
            </View>

            <Button
              title="Revisar pedido no carrinho"
              onPress={finishSharedOrder}
              style={{ marginTop: 15 }}
            />
          </View>
        ) : null}
      </View>
    </ScrollView>
  );

  const renderFeedback = () => (
    <ScrollView>
      <Header title="Sua avaliação" subtitle="Sua opinião faz a diferença!" />

      <View style={styles.content}>
        <View style={styles.feedbackCard}>
          <Text style={{ fontSize: 55 }}>⭐</Text>
          <Text style={styles.detailTitle}>Como foi sua experiência?</Text>
          <Text style={styles.mutedText}>
            Conte para nós o que achou da GANA Pasta.
          </Text>

          <View style={styles.ratingRow}>
            {[1, 2, 3, 4, 5].map((number) => (
              <TouchableOpacity
                key={number}
                onPress={() => setRating(number)}
              >
                <Text style={{ fontSize: 35 }}>
                  {number <= rating ? "⭐" : "☆"}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <TextInput
            style={[styles.input, { height: 120, textAlignVertical: "top" }]}
            placeholder="Escreva seu comentário..."
            placeholderTextColor={COLORS.gray}
            value={feedback}
            onChangeText={setFeedback}
            multiline
          />

          <Button
            title="Enviar avaliação"
            onPress={() => {
              showNotice("Obrigado por avaliar a GANA Pasta!");
              setFeedback("");
              setScreen("home");
            }}
            style={{ marginTop: 15 }}
          />
        </View>
      </View>
    </ScrollView>
  );

  const renderScreen = () => {
    switch (screen) {
      case "home":
        return renderHome();
      case "menu":
        return renderMenu();
      case "product":
        return renderProduct();
      case "cart":
        return renderCart();
      case "orders":
        return renderOrders();
      case "chat":
        return renderChat();
      case "profile":
        return renderProfile();
      case "club":
        return renderClub();
      case "shared":
        return renderShared();
      case "feedback":
        return renderFeedback();
      case "admin":
        return renderAdmin();
      default:
        return renderHome();
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar backgroundColor={COLORS.darkRed} barStyle="light-content" />

      <View style={styles.appContainer}>
        <View style={styles.screenContainer}>{renderScreen()}</View>

        <View style={styles.bottomNav}>
          {[
            { id: "home", icon: "🏠", label: "Início" },
            { id: "menu", icon: "🍝", label: "Cardápio" },
            { id: "chat", icon: "🤖", label: "Pastechat" },
            { id: "orders", icon: "📦", label: "Pedidos" },
            { id: "profile", icon: "👤", label: "Conta" },
          ].map((item) => (
            <TouchableOpacity
              key={item.id}
              style={styles.navItem}
              onPress={() => setScreen(item.id)}
            >
              <Text style={styles.navIcon}>{item.icon}</Text>
              <Text
                style={[
                  styles.navLabel,
                  screen === item.id && styles.navLabelActive,
                ]}
              >
                {item.label}
              </Text>

              {screen === item.id && <View style={styles.navIndicator} />}
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.cream,
    width: "100%"
  },

  appContainer: {
  flex: 1,
  width: "100%",
  maxWidth: 430,
  alignSelf: "center",
  backgroundColor: COLORS.cream,
  overflow: "hidden",
  },

  screenContainer: {
    flex: 1,
  },

  content: {
    paddingHorizontal: 18,
    paddingTop: 16,
  },

  hero: {
    backgroundColor: COLORS.red,
    paddingHorizontal: 20,
    paddingTop: 15,
    paddingBottom: 25,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
  },

  topBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  brandSmall: {
    color: COLORS.gold,
    fontSize: 10,
    fontWeight: "900",
    letterSpacing: 3,
  },

  brandName: {
    color: COLORS.white,
    fontSize: 25,
    fontWeight: "900",
    letterSpacing: 2,
  },

  avatar: {
    backgroundColor: COLORS.white,
    height: 45,
    width: 45,
    borderRadius: 23,
    alignItems: "center",
    justifyContent: "center",
  },

  heroContent: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 22,
  },

  heroTitle: {
    color: COLORS.white,
    fontSize: 32,
    fontWeight: "900",
    lineHeight: 37,
  },

  heroSubtitle: {
    color: "#FFE9E6",
    fontSize: 13,
    lineHeight: 20,
    marginTop: 9,
  },

  mascotCircle: {
    height: 125,
    width: 125,
    borderRadius: 63,
    backgroundColor: COLORS.gold,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 8,
    borderWidth: 4,
    borderColor: "#F6D982",
  },

  mascotMoustache: {
    position: "absolute",
    fontSize: 32,
    color: COLORS.dark,
    bottom: 12,
  },

  button: {
    backgroundColor: COLORS.red,
    paddingVertical: 13,
    paddingHorizontal: 18,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },

  buttonText: {
    color: COLORS.white,
    fontWeight: "800",
    fontSize: 13,
  },

  buttonSecondary: {
    backgroundColor: COLORS.lightGray,
  },

  buttonSecondaryText: {
    color: COLORS.dark,
  },

  buttonOutline: {
    backgroundColor: "transparent",
    borderWidth: 1.5,
    borderColor: COLORS.red,
  },

  buttonOutlineText: {
    color: COLORS.red,
  },

  buttonGold: {
    backgroundColor: COLORS.gold,
  },

  buttonGoldText: {
    color: COLORS.darkRed,
  },

  buttonDanger: {
    backgroundColor: COLORS.darkRed,
  },

  welcomeRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 17,
  },

  greeting: {
    fontSize: 23,
    color: COLORS.dark,
    fontWeight: "900",
  },

  mutedText: {
    color: COLORS.gray,
    fontSize: 12,
    lineHeight: 18,
    marginTop: 4,
  },

  pointsPill: {
    backgroundColor: "#FFF0C4",
    paddingVertical: 9,
    paddingHorizontal: 12,
    borderRadius: 20,
  },

  pointsText: {
    color: COLORS.darkRed,
    fontSize: 12,
    fontWeight: "800",
  },

  searchBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.white,
    paddingHorizontal: 15,
    height: 49,
    borderRadius: 14,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#EEE5D8",
  },

  searchIcon: {
    fontSize: 18,
    marginRight: 10,
  },

  searchPlaceholder: {
    color: COLORS.gray,
    fontSize: 13,
  },

  promoCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.darkRed,
    padding: 17,
    borderRadius: 17,
    marginBottom: 23,
  },

  promoEyebrow: {
    color: COLORS.gold,
    fontSize: 9,
    fontWeight: "900",
    letterSpacing: 1.5,
  },

  promoTitle: {
    color: COLORS.white,
    fontSize: 19,
    fontWeight: "900",
    marginTop: 6,
  },

  promoSubtitle: {
    color: "#F6D9D8",
    fontSize: 12,
    marginTop: 4,
  },

  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 13,
    marginTop: 5,
  },

  sectionTitle: {
    color: COLORS.dark,
    fontSize: 17,
    fontWeight: "900",
    marginBottom: 8,
  },

  seeAll: {
    color: COLORS.red,
    fontSize: 12,
    fontWeight: "800",
  },

  categoryCard: {
    width: 91,
    height: 95,
    backgroundColor: COLORS.white,
    borderRadius: 15,
    marginRight: 10,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#EEE5D8",
  },

  categoryText: {
    fontSize: 11,
    fontWeight: "800",
    color: COLORS.dark,
    marginTop: 8,
  },

  productCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.white,
    padding: 11,
    borderRadius: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#EEE8DF",
  },

  productEmoji: {
    height: 82,
    width: 82,
    borderRadius: 13,
    backgroundColor: "#FFF1D7",
    alignItems: "center",
    justifyContent: "center",
  },

  productInfo: {
    flex: 1,
    marginLeft: 12,
    marginRight: 5,
  },

  productName: {
    fontSize: 14,
    fontWeight: "900",
    color: COLORS.dark,
  },

  productDescription: {
    fontSize: 11,
    color: COLORS.gray,
    lineHeight: 16,
    marginTop: 5,
  },

  productPrice: {
    fontSize: 14,
    color: COLORS.red,
    fontWeight: "900",
    marginTop: 7,
  },

  addCircle: {
    height: 31,
    width: 31,
    borderRadius: 16,
    backgroundColor: COLORS.red,
    alignItems: "center",
    justifyContent: "center",
  },

  addCircleText: {
    color: COLORS.white,
    fontSize: 23,
    lineHeight: 26,
    fontWeight: "700",
  },

  featureCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.white,
    padding: 13,
    borderRadius: 15,
    marginTop: 10,
    borderWidth: 1,
    borderColor: "#EEE5D8",
    gap: 10,
  },

  featureTitle: {
    fontSize: 13,
    fontWeight: "900",
    color: COLORS.dark,
  },

  featureText: {
    color: COLORS.gray,
    fontSize: 11,
    lineHeight: 16,
    marginTop: 4,
  },

  pageHeader: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.red,
    paddingHorizontal: 17,
    paddingVertical: 15,
    minHeight: 76,
  },

  backButton: {
    width: 37,
    height: 37,
    borderRadius: 12,
    backgroundColor: "rgba(255,255,255,0.15)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },

  backButtonText: {
    color: COLORS.white,
    fontSize: 31,
    lineHeight: 33,
    marginTop: -3,
  },

  pageTitle: {
    color: COLORS.white,
    fontSize: 18,
    fontWeight: "900",
  },

  pageSubtitle: {
    color: "#F6D9D8",
    fontSize: 11,
    marginTop: 3,
  },

  cartIcon: {
    padding: 5,
    marginLeft: 6,
  },

  cartIconText: {
    fontSize: 23,
  },

  cartBadge: {
    position: "absolute",
    top: -2,
    right: -2,
    backgroundColor: COLORS.gold,
    height: 17,
    minWidth: 17,
    borderRadius: 9,
    alignItems: "center",
    justifyContent: "center",
  },

  cartBadgeText: {
    color: COLORS.darkRed,
    fontSize: 10,
    fontWeight: "900",
  },

  input: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 13,
    color: COLORS.dark,
    borderWidth: 1,
    borderColor: "#E7DFD5",
    marginBottom: 12,
  },

  filterChip: {
    paddingHorizontal: 17,
    paddingVertical: 10,
    backgroundColor: COLORS.white,
    borderRadius: 20,
    marginRight: 8,
    borderWidth: 1,
    borderColor: "#E7DFD5",
    alignSelf: "flex-start",
  },

  filterChipActive: {
    backgroundColor: COLORS.red,
    borderColor: COLORS.red,
  },

  filterChipText: {
    fontSize: 12,
    fontWeight: "700",
    color: COLORS.dark,
  },

  filterChipTextActive: {
    color: COLORS.white,
  },

  emptyText: {
    textAlign: "center",
    color: COLORS.gray,
    padding: 30,
  },

  productHero: {
    height: 205,
    backgroundColor: "#FFE9BF",
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },

  detailTitle: {
    fontSize: 24,
    color: COLORS.dark,
    fontWeight: "900",
    marginBottom: 7,
  },

  detailPrice: {
    fontSize: 21,
    color: COLORS.red,
    fontWeight: "900",
  },

  detailDescription: {
    color: COLORS.gray,
    fontSize: 13,
    lineHeight: 20,
    marginVertical: 15,
  },

  ingredientRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: COLORS.white,
    padding: 13,
    borderRadius: 12,
    marginTop: 8,
    borderWidth: 1,
    borderColor: "#EEE5D8",
  },

  ingredientName: {
    color: COLORS.dark,
    fontSize: 13,
    fontWeight: "600",
  },

  checkbox: {
    height: 23,
    width: 23,
    borderRadius: 6,
    borderWidth: 1.5,
    borderColor: "#B9B1A7",
    alignItems: "center",
    justifyContent: "center",
  },

  checkboxActive: {
    backgroundColor: COLORS.green,
    borderColor: COLORS.green,
  },

  checkboxText: {
    color: COLORS.white,
    fontWeight: "900",
  },

  quantityRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
  },

  quantityButton: {
    height: 40,
    width: 40,
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.red,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },

  quantityButtonText: {
    fontSize: 24,
    color: COLORS.red,
    fontWeight: "800",
  },

  quantityNumber: {
    fontSize: 17,
    fontWeight: "900",
    color: COLORS.dark,
    marginHorizontal: 25,
  },

  emptyCard: {
    backgroundColor: COLORS.white,
    borderRadius: 18,
    alignItems: "center",
    padding: 30,
    marginTop: 20,
  },

  emptyTitle: {
    color: COLORS.dark,
    fontSize: 17,
    fontWeight: "900",
    marginTop: 15,
  },

  cartItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.white,
    padding: 12,
    borderRadius: 15,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#EEE5D8",
  },

  smallQuantityRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 9,
  },

  smallQuantityButton: {
    height: 28,
    width: 28,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#E7DFD5",
    backgroundColor: COLORS.cream,
    alignItems: "center",
    justifyContent: "center",
  },

  choiceRow: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 15,
  },

  choiceCard: {
    flex: 1,
    alignItems: "center",
    padding: 15,
    backgroundColor: COLORS.white,
    borderRadius: 13,
    borderWidth: 1,
    borderColor: "#E7DFD5",
  },

  choiceCardActive: {
    backgroundColor: "#FFF0D0",
    borderColor: COLORS.red,
    borderWidth: 1.5,
  },

  choiceText: {
    fontSize: 12,
    color: COLORS.dark,
    fontWeight: "700",
    marginTop: 6,
  },

  choiceTextActive: {
    color: COLORS.red,
  },

  label: {
    fontSize: 12,
    fontWeight: "800",
    color: COLORS.dark,
    marginTop: 15,
    marginBottom: 8,
  },

  couponRow: {
    flexDirection: "row",
    alignItems: "center",
  },

  paymentRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: COLORS.white,
    padding: 14,
    borderRadius: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: "#EEE5D8",
  },

  paymentName: {
    color: COLORS.dark,
    fontSize: 13,
    fontWeight: "600",
  },

  radio: {
    height: 21,
    width: 21,
    borderRadius: 11,
    borderWidth: 1.5,
    borderColor: "#AFA79D",
    alignItems: "center",
    justifyContent: "center",
  },

  radioActive: {
    borderColor: COLORS.red,
  },

  radioDot: {
    height: 11,
    width: 11,
    borderRadius: 6,
    backgroundColor: COLORS.red,
  },

  summaryCard: {
    backgroundColor: COLORS.white,
    borderRadius: 15,
    padding: 17,
    marginTop: 22,
    borderWidth: 1,
    borderColor: "#EEE5D8",
  },

  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 6,
  },

  summaryLabel: {
    color: COLORS.gray,
    fontSize: 12,
    flex: 1,
    marginRight: 8,
  },

  summaryValue: {
    color: COLORS.dark,
    fontSize: 13,
    fontWeight: "700",
  },

  divider: {
    height: 1,
    backgroundColor: "#EDE5DA",
    marginVertical: 12,
  },

  totalLabel: {
    fontSize: 16,
    color: COLORS.dark,
    fontWeight: "900",
  },

  totalValue: {
    fontSize: 19,
    color: COLORS.red,
    fontWeight: "900",
  },

  orderCard: {
    backgroundColor: COLORS.white,
    padding: 15,
    borderRadius: 16,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "#EEE5D8",
  },

  orderHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },

  statusPill: {
    backgroundColor: "#FFF0C4",
    borderRadius: 15,
    paddingVertical: 7,
    paddingHorizontal: 10,
  },

  statusText: {
    fontSize: 10,
    color: COLORS.darkRed,
    fontWeight: "900",
  },

  orderItemText: {
    fontSize: 12,
    color: COLORS.dark,
    marginVertical: 4,
  },

  trackingBox: {
    backgroundColor: "#F4F8F3",
    borderRadius: 12,
    padding: 12,
    marginTop: 12,
  },

  trackingTitle: {
    color: COLORS.green,
    fontWeight: "900",
    fontSize: 12,
  },

  trackingText: {
    color: COLORS.dark,
    fontSize: 12,
    lineHeight: 19,
    marginTop: 6,
  },

  adminStatusButton: {
    padding: 10,
    borderWidth: 1,
    borderColor: "#E7DFD5",
    borderRadius: 10,
    marginTop: 6,
  },

  adminStatusButtonActive: {
    backgroundColor: COLORS.red,
    borderColor: COLORS.red,
  },

  adminStatusText: {
    color: COLORS.dark,
    fontSize: 12,
    fontWeight: "700",
    textAlign: "center",
  },

  adminStatusTextActive: {
    color: COLORS.white,
  },

  chatWelcome: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    backgroundColor: COLORS.white,
    gap: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#EEE5D8",
  },

  chatMessages: {
    flex: 1,
    paddingHorizontal: 15,
    paddingTop: 15,
  },

  chatBubble: {
    maxWidth: "86%",
    padding: 13,
    borderRadius: 15,
    marginBottom: 10,
  },

  chatBubbleBot: {
    alignSelf: "flex-start",
    backgroundColor: COLORS.white,
    borderBottomLeftRadius: 4,
  },

  chatBubbleUser: {
    alignSelf: "flex-end",
    backgroundColor: COLORS.red,
    borderBottomRightRadius: 4,
  },

  chatText: {
    fontSize: 13,
    color: COLORS.dark,
    lineHeight: 19,
  },

  chatTextUser: {
    color: COLORS.white,
  },

  chatSuggestionsTitle: {
    color: COLORS.gray,
    fontSize: 11,
    fontWeight: "800",
    marginVertical: 12,
  },

  suggestionChip: {
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: "#E7DFD5",
    padding: 11,
    borderRadius: 20,
    marginBottom: 8,
    alignSelf: "flex-start",
  },

  suggestionText: {
    color: COLORS.darkRed,
    fontSize: 12,
    fontWeight: "600",
  },

  chatInputRow: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    backgroundColor: COLORS.white,
    borderTopWidth: 1,
    borderTopColor: "#EEE5D8",
  },

  chatInput: {
    flex: 1,
    marginBottom: 0,
  },

  chatSendButton: {
    width: 46,
    height: 46,
    borderRadius: 13,
    backgroundColor: COLORS.red,
    marginLeft: 8,
    alignItems: "center",
    justifyContent: "center",
  },

  chatSendText: {
    fontSize: 23,
    color: COLORS.white,
  },

  profileCard: {
    backgroundColor: COLORS.white,
    borderRadius: 18,
    padding: 20,
    alignItems: "center",
    marginBottom: 18,
  },

  profileAvatar: {
    height: 95,
    width: 95,
    borderRadius: 48,
    backgroundColor: "#FFF0D0",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },

  profileName: {
    color: COLORS.dark,
    fontSize: 21,
    fontWeight: "900",
    marginBottom: 5,
  },

  pointsCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: 17,
    borderRadius: 15,
    backgroundColor: "#FFF0C4",
    marginBottom: 17,
    gap: 12,
  },

  pointsCardTitle: {
    color: COLORS.darkRed,
    fontSize: 13,
    fontWeight: "900",
  },

  pointsCardSubtitle: {
    color: COLORS.darkRed,
    fontSize: 12,
    marginTop: 5,
  },

  menuLink: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderRadius: 13,
    backgroundColor: COLORS.white,
    marginBottom: 9,
    borderWidth: 1,
    borderColor: "#EEE5D8",
  },

  menuLinkIcon: {
    fontSize: 22,
    marginRight: 13,
  },

  menuLinkText: {
    flex: 1,
    fontSize: 13,
    fontWeight: "800",
    color: COLORS.dark,
  },

  menuLinkArrow: {
    fontSize: 24,
    color: COLORS.gray,
  },

  helperText: {
    fontSize: 11,
    color: COLORS.gray,
    lineHeight: 17,
    marginTop: 12,
    marginBottom: 8,
  },

  clubHero: {
    backgroundColor: COLORS.red,
    borderRadius: 22,
    padding: 25,
    alignItems: "center",
    marginBottom: 25,
  },

  clubTitle: {
    color: COLORS.gold,
    fontSize: 20,
    fontWeight: "900",
    textAlign: "center",
    marginTop: 12,
  },

  clubSubtitle: {
    color: COLORS.white,
    fontSize: 12,
    textAlign: "center",
    lineHeight: 19,
    marginTop: 10,
  },

  planCard: {
    backgroundColor: COLORS.white,
    borderRadius: 18,
    borderWidth: 2,
    borderColor: COLORS.gold,
    padding: 20,
    marginTop: 10,
  },

  planName: {
    color: COLORS.dark,
    fontSize: 20,
    fontWeight: "900",
  },

  planPrice: {
    color: COLORS.red,
    fontSize: 22,
    fontWeight: "900",
    marginVertical: 10,
  },

  planDescription: {
    color: COLORS.gray,
    fontSize: 13,
    lineHeight: 25,
    marginBottom: 18,
  },

  sharedBanner: {
    backgroundColor: "#FFF0D0",
    borderRadius: 18,
    padding: 22,
    alignItems: "center",
    marginBottom: 18,
  },

  sharedBannerTitle: {
    color: COLORS.dark,
    fontSize: 19,
    fontWeight: "900",
    textAlign: "center",
    marginTop: 10,
  },

  sharedBannerText: {
    color: COLORS.gray,
    fontSize: 12,
    lineHeight: 18,
    textAlign: "center",
    marginTop: 8,
  },

  sharedCodeCard: {
    backgroundColor: COLORS.white,
    borderRadius: 17,
    padding: 16,
    marginTop: 22,
    borderWidth: 1,
    borderColor: "#EEE5D8",
  },

  sharedCode: {
    fontSize: 30,
    fontWeight: "900",
    color: COLORS.red,
    letterSpacing: 5,
    textAlign: "center",
    marginVertical: 12,
  },

  sharedProductRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#EEE5D8",
  },

  feedbackCard: {
    backgroundColor: COLORS.white,
    borderRadius: 18,
    padding: 22,
    alignItems: "center",
  },

  ratingRow: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 18,
    gap: 8,
  },

  adminBanner: {
    backgroundColor: COLORS.darkRed,
    borderRadius: 18,
    padding: 20,
    alignItems: "center",
    marginBottom: 18,
  },

  adminBannerTitle: {
    color: COLORS.white,
    fontSize: 20,
    fontWeight: "900",
    marginTop: 10,
  },

  adminBannerText: {
    color: "#F6D9D8",
    fontSize: 12,
    lineHeight: 18,
    textAlign: "center",
    marginTop: 8,
  },

  adminStatsRow: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 25,
  },

  adminStatCard: {
    flex: 1,
    backgroundColor: COLORS.white,
    borderRadius: 13,
    paddingVertical: 16,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#EEE5D8",
  },

  adminStatNumber: {
    color: COLORS.red,
    fontSize: 23,
    fontWeight: "900",
  },

  adminStatLabel: {
    color: COLORS.gray,
    fontSize: 10,
    marginTop: 5,
  },

  adminProductRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.white,
    padding: 14,
    borderRadius: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: "#EEE5D8",
  },

  deleteText: {
    color: COLORS.red,
    fontSize: 12,
    fontWeight: "900",
    padding: 8,
  },

  bottomNav: {
    height: 66,
    backgroundColor: COLORS.white,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    borderTopWidth: 1,
    borderTopColor: "#EEE5D8",
    paddingBottom: 3,
  },

  navItem: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    height: 60,
  },

  navIcon: {
    fontSize: 20,
  },

  navLabel: {
    fontSize: 9,
    color: COLORS.gray,
    marginTop: 3,
    fontWeight: "600",
  },

  navLabelActive: {
    color: COLORS.red,
    fontWeight: "900",
  },

  navIndicator: {
    height: 3,
    width: 20,
    borderRadius: 2,
    backgroundColor: COLORS.gold,
    marginTop: 3,
  },
});