# Guia de Contribuição

## Visão Geral

Este projeto implementa um sistema completo de gestão de laboratório geotécnico com foco em qualidade, acessibilidade e segurança. Contribuições são bem-vindas e devem seguir os padrões estabelecidos.

## Configuração do Ambiente

### Pré-requisitos
- Node.js 20+
- PostgreSQL 15+
- Firebase project configurado
- Git

### Instalação
```bash
git clone <repository-url>
cd geotechnical-lab
npm install
npm run db:push
```

### Variáveis de Ambiente
Copie `.env.example` para `.env` e configure:
```env
DATABASE_URL=postgresql://...
VITE_FIREBASE_PROJECT_ID=...
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_APP_ID=...
```

## Padrões de Desenvolvimento

### Estrutura de Código
- **Modular**: Separar lógica de negócio em serviços
- **TypeScript**: Tipagem estrita obrigatória
- **Funcional**: Preferir funções puras quando possível
- **Testável**: Código deve ser facilmente testável

### Convenções de Nomenclatura
```typescript
// Componentes: PascalCase
const DensityTestForm = () => { ... }

// Funções: camelCase
const calculateDensity = (data: TestData) => { ... }

// Constantes: UPPER_SNAKE_CASE
const MAX_DENSITY_VALUE = 4.0;

// Interfaces: PascalCase com "I" prefix para interfaces de serviço
interface ICalculationService { ... }
interface TestData { ... }
```

### Estrutura de Arquivos
```
src/
├── services/           # Lógica de negócio
├── components/         # Componentes React
├── hooks/             # Custom hooks
├── utils/             # Utilitários
├── types/             # Definições de tipos
└── test/              # Testes
```

## Processo de Contribuição

### 1. Planejamento
- Criar issue descrevendo a funcionalidade/bug
- Discussão com mantenedores
- Definição de critérios de aceitação

### 2. Desenvolvimento
```bash
# Criar branch feature
git checkout -b feature/nome-da-feature

# Desenvolver com commits pequenos e descritivos
git commit -m "feat: add density calculation validation"

# Executar testes localmente
npm test
npm run lint
```

### 3. Testes
- **Unitários**: Cobertura mínima de 90%
- **Integração**: Testar fluxos críticos
- **Acessibilidade**: Executar auditoria axe-core

```bash
# Executar todos os testes
npm run test:coverage

# Testes de acessibilidade
npm run test:a11y

# Lint e type check
npm run lint
npm run type-check
```

### 4. Pull Request
- Template PR preenchido completamente
- Testes passando
- Code review aprovado
- Merge após aprovação

## Padrões de Qualidade

### Cálculos Geotécnicos
- Seguir normas ABNT (NBR 9813, NBR 6508, etc.)
- Validação rigorosa de entrada e saída
- Tratamento de casos extremos
- Documentação das fórmulas utilizadas

### Segurança
- Validação no frontend e backend
- Sanitização de inputs
- Controle de acesso baseado em função
- Logs de auditoria

### Performance
- Lazy loading de componentes
- Otimização de queries
- Cache inteligente
- Bundle size < 1MB

### Acessibilidade
- Conformidade WCAG 2.1 AA
- Navegação por teclado
- Suporte a leitores de tela
- Contraste adequado (4.5:1 mínimo)

## Testes

### Estrutura de Testes
```typescript
describe('CalculationService', () => {
  describe('densityInSitu', () => {
    it('should calculate wet density correctly', () => {
      // Arrange
      const input = { volume: 100, weight: 180.5 };
      
      // Act
      const result = CalculationService.densityInSitu.calculateWetDensity(
        input.volume, 
        input.weight
      );
      
      // Assert
      expect(result).toBeCloseTo(1.805, 3);
    });
    
    it('should throw error for invalid input', () => {
      expect(() => {
        CalculationService.densityInSitu.calculateWetDensity(0, 100);
      }).toThrow('Invalid volume or weight values');
    });
  });
});
```

### Testes de Componentes
```typescript
describe('DensityInSituForm', () => {
  it('should render all required fields', () => {
    render(<DensityInSituForm />);
    
    expect(screen.getByLabelText(/obra/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/local/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/profundidade/i)).toBeInTheDocument();
  });
  
  it('should validate required fields', async () => {
    const user = userEvent.setup();
    render(<DensityInSituForm />);
    
    await user.click(screen.getByRole('button', { name: /salvar/i }));
    
    expect(screen.getByText(/obra é obrigatória/i)).toBeInTheDocument();
  });
});
```

### Testes de Acessibilidade
```typescript
it('should not have accessibility violations', async () => {
  const { container } = render(<TestComponent />);
  const results = await axe(container);
  expect(results).toHaveNoViolations();
});
```

## Documentação

### Código
- JSDoc para funções públicas
- Comentários explicativos para lógica complexa
- README atualizado para cada módulo

### Commits
Seguir Conventional Commits:
```
feat: add new density calculation method
fix: resolve sync conflict resolution
docs: update API documentation
test: add unit tests for validation service
refactor: extract calculation logic to service
```

### API
Documentar endpoints com exemplos:
```typescript
/**
 * Create a new density test
 * @route POST /api/tests/density-in-situ
 * @body {DensityInSituData} testData
 * @returns {DensityInSituTest} created test
 * @throws {ValidationError} invalid input data
 */
```

## Debug e Troubleshooting

### Logging
```typescript
// Usar logger estruturado
logger.info('Calculation completed', {
  testId: test.id,
  calculationType: 'density-in-situ',
  duration: Date.now() - startTime
});
```

### Debug Mode
```bash
# Ativar logs verbosos
DEBUG=geotechlab:* npm run dev

# Executar testes com debug
DEBUG=geotechlab:test npm test
```

### Ferramentas
- Chrome DevTools para performance
- React DevTools para componentes
- PostgreSQL logs para queries
- Firebase Console para Firestore

## Segurança

### Princípios
- Princípio do menor privilégio
- Validação em múltiplas camadas
- Sanitização de dados
- Auditoria completa

### Implementação
```typescript
// Validação de entrada
const validateTestData = (data: unknown): DensityInSituData => {
  const schema = z.object({
    projectName: z.string().min(1).max(100),
    location: z.string().min(1).max(100),
    depth: z.number().positive()
  });
  
  return schema.parse(data);
};

// Controle de acesso
const requireRole = (roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Insufficient permissions' });
    }
    next();
  };
};
```

## Performance

### Otimizações Frontend
- Code splitting por rota
- Lazy loading de componentes pesados
- Memoização de cálculos caros
- Virtualization para listas grandes

### Otimizações Backend
- Conexão pool para database
- Cache Redis para queries frequentes
- Índices otimizados
- Paginação para resultados grandes

## Deploy

### Ambientes
- **Development**: Deploy automático em PRs
- **Staging**: Deploy em merge para develop
- **Production**: Deploy manual com aprovação

### Pipeline CI/CD
1. Lint e type check
2. Testes unitários
3. Testes de integração
4. Build e otimização
5. Testes de acessibilidade
6. Security scan
7. Deploy

### Rollback
```bash
# Rollback rápido via tag
git tag -l | head -5
git checkout v1.2.3
npm run deploy:production
```

## Contato

- **Issues**: GitHub Issues
- **Discussões**: GitHub Discussions
- **Security**: security@geotechlab.com
- **Documentação**: docs.geotechlab.com

## Licença

MIT License - veja LICENSE para detalhes.